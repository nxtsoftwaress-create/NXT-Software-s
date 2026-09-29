"use client"

import * as React from "react"
import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  WEB3FORMS_ACCESS_KEY,
  WEB3FORMS_ENDPOINT,
  WHATSAPP_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  EMAIL_HELLO,
  LEGAL_ROUTES,
} from "@/lib/site"
import { ArrowRight, Mail, Phone, Headphones, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import * as d3 from "d3"
import { feature } from "topojson-client"
import type {
  Topology,
  GeometryCollection,
  GeometryObject,
} from "topojson-specification"
import type { FeatureCollection } from "geojson"
import type { GeoPermissibleObjects } from "d3"

const smoothEase = [0.25, 0.1, 0.25, 1] as const

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: EMAIL_HELLO,
    href: `mailto:${EMAIL_HELLO}`,
  },
  { icon: Phone, label: PHONE_DISPLAY, href: PHONE_TEL },
  {
    icon: MessageCircle,
    label: "WhatsApp — usually replies fastest",
    href: WHATSAPP_URL,
  },
  {
    icon: Headphones,
    label: EMAIL_HELLO,
    href: `mailto:${EMAIL_HELLO}`,
  },
]

interface GlobeWireframeProps {
  width?: number
  height?: number
  className?: string
  strokeColor?: string
  strokeWidth?: number
  graticuleColor?: string
  graticuleOpacity?: number
  sphereOutlineColor?: string
  sphereOutlineWidth?: number
  autoRotate?: boolean
  autoRotateSpeed?: number
  rotateToLocation?: string | [number, number]
  rotateCities?: string[]
  rotationSpeed?: number
  initialRotation?: [number, number]
  enableInteraction?: boolean
  showGraticule?: boolean
  animationDuration?: number
  startAsGlobe?: boolean
  countryFillColor?: string
  countryHoverColor?: string
  variant?: "wireframe" | "wireframesolid" | "solid"
  scale?: number
  backgroundColor?: string
}

interface GeoFeature {
  type: string
  geometry: GeometryObject
  properties: Record<string, unknown>
}

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection
  }
}

interface CustomProjection extends d3.GeoProjection {
  alpha(value: number): CustomProjection
  alpha(): number
}

const cityCoordinates: Record<string, [number, number]> = {
  "san francisco": [37.7749, -122.4194],
  "new york": [40.7128, -74.006],
  london: [51.5074, -0.1278],
  tokyo: [35.6762, 139.6503],
  paris: [48.8566, 2.3522],
  moscow: [55.7558, 37.6176],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  sydney: [-33.8688, 151.2093],
  mumbai: [19.076, 72.8777],
  "los angeles": [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
}

function orthographicRaw(x: number, y: number): [number, number] {
  const cosy = Math.cos(y)
  return [cosy * Math.sin(x), Math.sin(y)]
}

function equirectangularRaw(lambda: number, phi: number): [number, number] {
  return [lambda, phi]
}

function interpolateProjection(
  raw0: (lambda: number, phi: number) => [number, number],
  raw1: (lambda: number, phi: number) => [number, number],
): CustomProjection {
  let t = 0

  const createRawProjection = (
    alpha: number,
  ): ((lambda: number, phi: number) => [number, number]) => {
    return (lambda: number, phi: number): [number, number] => {
      const [x0, y0] = raw0(lambda, phi)
      const [x1, y1] = raw1(lambda, phi)
      return [x0 + alpha * (x1 - x0), y0 + alpha * (y1 - y0)]
    }
  }

  const projection = d3.geoProjection(
    createRawProjection(t),
  ) as unknown as CustomProjection

  const alphaMethod = ((value?: number): CustomProjection | number => {
    if (value !== undefined) {
      t = +value
      const newProjection = d3.geoProjection(
        createRawProjection(t),
      ) as unknown as CustomProjection

      if (projection.scale()) newProjection.scale(projection.scale())
      if (projection.translate())
        newProjection.translate(projection.translate())
      if (projection.rotate()) newProjection.rotate(projection.rotate())
      if (projection.precision())
        newProjection.precision(projection.precision())

      newProjection.alpha = alphaMethod as CustomProjection["alpha"]

      return newProjection
    }
    return t
  }) as CustomProjection["alpha"]

  projection.alpha = alphaMethod

  return projection
}

function GlobeWireframe({
  width,
  height,
  className = "aspect-square w-full max-w-[37.5rem]",
  strokeColor,
  strokeWidth = 1.0,
  graticuleColor,
  graticuleOpacity = 0.2,
  sphereOutlineColor,
  sphereOutlineWidth = 1,
  autoRotate = true,
  autoRotateSpeed = 0.5,
  rotateToLocation,
  rotateCities = [],
  rotationSpeed = 3000,
  initialRotation = [0, 0],
  enableInteraction = true,
  showGraticule = true,
  startAsGlobe = true,
  countryFillColor,
  countryHoverColor,
  variant = "wireframe",
  scale = 1,
  backgroundColor,
}: GlobeWireframeProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress] = useState(startAsGlobe ? 0 : 100)
  const [worldData, setWorldData] = useState<GeoFeature[]>([])
  const [rotation, setRotation] = useState<[number, number]>(initialRotation)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState([0, 0])
  const [isVisible, setIsVisible] = useState(false)
  const rotationInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const rotationAnimFrame = useRef<number | null>(null)
  const rotationStartTime = useRef<number | null>(null)
  const rotationFrom = useRef<[number, number]>([0, 0])
  const rotationTo = useRef<[number, number]>([0, 0])
  const animationFrame = useRef<number | null>(null)
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const resizeObserver = useRef<ResizeObserver | null>(null)
  const rotationRef = useRef(rotation)

  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  const useResponsive = !width && !height
  const finalWidth = useResponsive ? dimensions.width : width || 800
  const finalHeight = useResponsive ? dimensions.height : height || 500

  const defaultStrokeColor = strokeColor || "currentColor"
  const defaultGraticuleColor = graticuleColor || "currentColor"
  const defaultSphereOutlineColor = sphereOutlineColor || "currentColor"
  const defaultCountryFillColor =
    countryFillColor || (variant === "solid" ? "currentColor" : "none")
  const defaultBackgroundColor = backgroundColor || "transparent"

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const updateDimensions = () => {
      if (container && useResponsive) {
        const width = container.offsetWidth || 300
        setDimensions({ width, height: width })
      }
    }

    updateDimensions()

    if (useResponsive) {
      resizeObserver.current = new ResizeObserver(updateDimensions)
      resizeObserver.current.observe(container)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    observer.observe(container)

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
      observer.unobserve(container)
    }
  }, [useResponsive])

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
        )
        const world = (await response.json()) as WorldAtlasTopology
        const countries = (feature(
          world,
          world.objects.countries,
        ) as unknown as FeatureCollection).features as GeoFeature[]
        setWorldData(countries)
      } catch (error) {
        console.error("Error loading world data:", error)
        const fallbackData: GeoFeature[] = [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90],
                ],
              ],
            } as unknown as GeometryObject,
            properties: {},
          },
        ]
        setWorldData(fallbackData)
      }
    }
    loadWorldData()
  }, [])

  useEffect(() => {
    if (!autoRotate || !isVisible || isDragging || rotateCities.length > 0) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
        animationFrame.current = null
      }
      return
    }

    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]])
      animationFrame.current = requestAnimationFrame(rotate)
    }

    animationFrame.current = requestAnimationFrame(rotate)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, rotateCities.length])

  const animateRotationTo = useCallback(
    (target: [number, number], duration = 1200) => {
      if (rotationAnimFrame.current) {
        cancelAnimationFrame(rotationAnimFrame.current)
      }

      rotationFrom.current = rotationRef.current
      rotationTo.current = target
      rotationStartTime.current = performance.now()

      const animate = (time: number) => {
        const elapsed = time - (rotationStartTime.current || 0)
        const t = Math.min(elapsed / duration, 1)

        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

        const lon =
          rotationFrom.current[0] +
          (rotationTo.current[0] - rotationFrom.current[0]) * eased

        const lat =
          rotationFrom.current[1] +
          (rotationTo.current[1] - rotationFrom.current[1]) * eased

        setRotation([lon, lat])

        if (t < 1) {
          rotationAnimFrame.current = requestAnimationFrame(animate)
        }
      }

      rotationAnimFrame.current = requestAnimationFrame(animate)
    },
    [],
  )

  useEffect(() => {
    if (rotateCities.length === 0 || !isVisible) return

    const rotateToNextCity = () => {
      const nextIndex = (currentCityIndex + 1) % rotateCities.length
      const city = rotateCities[nextIndex].toLowerCase()
      const coordinates = cityCoordinates[city]

      if (coordinates) {
        animateRotationTo(
          [-coordinates[1], -coordinates[0]],
          rotationSpeed * 0.6,
        )
        setCurrentCityIndex(nextIndex)
      }
    }

    const city = rotateCities[currentCityIndex].toLowerCase()
    const coordinates = cityCoordinates[city]

    if (coordinates) {
      animateRotationTo(
        [-coordinates[1], -coordinates[0]],
        rotationSpeed * 0.6,
      )
    }

    rotationInterval.current = setInterval(rotateToNextCity, rotationSpeed)

    return () => {
      if (rotationInterval.current) clearInterval(rotationInterval.current)
    }
  }, [
    rotateCities,
    currentCityIndex,
    rotationSpeed,
    isVisible,
    animateRotationTo,
  ])

  useEffect(() => {
    if (!rotateToLocation) return

    let coordinates: [number, number]
    if (typeof rotateToLocation === "string") {
      const city = rotateToLocation.toLowerCase()
      coordinates = cityCoordinates[city] || [0, 0]
    } else {
      coordinates = rotateToLocation
    }

    setRotation([-coordinates[1], -coordinates[0]])
  }, [rotateToLocation])

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!enableInteraction) return
    setIsDragging(true)
    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      setLastMouse([event.clientX - rect.left, event.clientY - rect.top])
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !enableInteraction) return
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return

    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top]
    const dx = currentMouse[0] - lastMouse[0]
    const dy = currentMouse[1] - lastMouse[1]

    const t = progress / 100
    let sensitivity: number

    if (variant === "wireframe") {
      sensitivity = t < 0.5 ? 0.5 : 0.25
    } else {
      sensitivity = 0.5
    }

    setRotation((prev) => [
      prev[0] + dx * sensitivity,
      Math.max(-90, Math.min(90, prev[1] - dy * sensitivity)),
    ])

    setLastMouse(currentMouse)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (!svgRef.current || worldData.length === 0 || !isVisible) return
    if (useResponsive && dimensions.width === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    let finalCountryFill = "none"
    let finalStrokeWidth = strokeWidth
    let finalOpacity = 1.0
    let renderGraticule = showGraticule
    let finalGraticuleOpacity = graticuleOpacity
    let finalSphereOutlineWidth = sphereOutlineWidth

    if (variant === "wireframe") {
      finalCountryFill = "none"
      finalStrokeWidth = strokeWidth
      finalOpacity = 1.0
      renderGraticule = showGraticule
      finalGraticuleOpacity = graticuleOpacity
      finalSphereOutlineWidth = sphereOutlineWidth
    } else if (variant === "wireframesolid") {
      finalCountryFill = "none"
      finalStrokeWidth = strokeWidth
      finalOpacity = 1.0
      renderGraticule = false
      finalGraticuleOpacity = 0
      finalSphereOutlineWidth = 1.5
    } else if (variant === "solid") {
      finalCountryFill = defaultCountryFillColor
      finalStrokeWidth = strokeWidth * 0.5
      finalOpacity = 0.3
      renderGraticule = false
      finalGraticuleOpacity = 0
      finalSphereOutlineWidth = 1.5
    }

    if (defaultBackgroundColor !== "transparent") {
      const radius = (Math.min(finalWidth, finalHeight) / 2) * scale * 0.9
      svg
        .append("circle")
        .attr("cx", finalWidth / 2)
        .attr("cy", finalHeight / 2)
        .attr("r", radius)
        .attr("fill", defaultBackgroundColor)
    }

    let projection: d3.GeoProjection | CustomProjection
    const path = d3.geoPath()

    if (variant === "wireframe") {
      const t = progress / 100
      const alpha = Math.pow(t, 0.5)

      const baseScale = Math.min(finalWidth, finalHeight) / 2
      const scaleRange = d3
        .scaleLinear()
        .domain([0, 1])
        .range([baseScale * 0.9 * scale, baseScale * 0.54 * scale])
      const baseRotate = d3.scaleLinear().domain([0, 1]).range([0, 0])

      projection = interpolateProjection(orthographicRaw, equirectangularRaw)
        .scale(scaleRange(alpha))
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([baseRotate(alpha) + rotation[0], rotation[1]])
        .precision(0.1)

      ;(projection as CustomProjection).alpha(alpha)
      path.projection(projection)
    } else {
      projection = d3
        .geoOrthographic()
        .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.9)
        .translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]])
        .precision(0.1)

      path.projection(projection)
    }

    if (renderGraticule && finalGraticuleOpacity > 0) {
      try {
        const graticule = d3.geoGraticule()
        const graticulePath = path(graticule())
        if (graticulePath) {
          svg
            .append("path")
            .datum(graticule())
            .attr("d", graticulePath)
            .attr("fill", "none")
            .attr("stroke", defaultGraticuleColor)
            .attr("stroke-width", 1)
            .attr("opacity", finalGraticuleOpacity)
        }
      } catch (error) {
        console.error("Error creating graticule:", error)
      }
    }

    svg
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d: GeoFeature) => {
        try {
          const pathString = path(d as unknown as GeoPermissibleObjects)
          if (!pathString) return ""
          if (
            typeof pathString === "string" &&
            (pathString.includes("NaN") || pathString.includes("Infinity"))
          ) {
            return ""
          }
          return pathString
        } catch (error) {
          return ""
        }
      })
      .attr("fill", finalCountryFill)
      .attr("stroke", defaultStrokeColor)
      .attr("stroke-width", finalStrokeWidth)
      .attr("opacity", finalOpacity)
      .style("visibility", function (this: SVGPathElement) {
        const pathData = d3.select(this).attr("d")
        return pathData && pathData.length > 0 && !pathData.includes("NaN")
          ? "visible"
          : "hidden"
      })
      .on("mouseenter", function (this: SVGPathElement) {
        if (countryHoverColor && variant === "solid") {
          d3.select(this).attr("fill", countryHoverColor)
        }
      })
      .on("mouseleave", function (this: SVGPathElement) {
        if (variant === "solid") {
          d3.select(this).attr("fill", finalCountryFill)
        }
      })

    try {
      const sphereOutline = path({ type: "Sphere" })
      if (sphereOutline) {
        svg
          .append("path")
          .datum({ type: "Sphere" })
          .attr("d", sphereOutline)
          .attr("fill", "none")
          .attr("stroke", defaultSphereOutlineColor)
          .attr("stroke-width", finalSphereOutlineWidth)
          .attr("opacity", variant === "wireframe" ? 1.0 : 0.8)
      }
    } catch (error) {
      console.error("Error creating sphere outline:", error)
    }
  }, [
    worldData,
    progress,
    rotation,
    isVisible,
    finalWidth,
    finalHeight,
    defaultStrokeColor,
    strokeWidth,
    defaultGraticuleColor,
    graticuleOpacity,
    defaultSphereOutlineColor,
    sphereOutlineWidth,
    showGraticule,
    defaultCountryFillColor,
    countryHoverColor,
    variant,
    scale,
    defaultBackgroundColor,
    useResponsive,
    dimensions.width,
  ])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <svg
        ref={svgRef}
        width={finalWidth}
        height={finalHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={
          useResponsive
            ? "w-full h-full opacity-0 transition-opacity duration-1000"
            : ""
        }
        style={{
          cursor: enableInteraction
            ? isDragging
              ? "grabbing"
              : "grab"
            : "default",
          opacity: useResponsive ? (dimensions.width > 0 ? 1 : 0) : 1,
        }}
      />
    </div>
  )
}

const FormDots = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => {
    const isHorizontal = orientation === "horizontal"
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 flex items-center justify-center overflow-hidden",
          isHorizontal ? "w-full" : "h-full",
          className,
        )}
        {...props}
      >
        <div
          className={cn("relative", isHorizontal ? "w-full h-4" : "h-full w-4")}
        >
          <div
            className={cn(
              "absolute inset-0 bg-repeat",
              "text-nxt-border",
            )}
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
              backgroundSize: isHorizontal ? "6px 100%" : "100% 6px",
              maskImage: isHorizontal
                ? "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
                : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          />
        </div>
      </SeparatorPrimitive.Root>
    )
  },
)
FormDots.displayName = "FormDots"

interface ContactWithGlobeProps {
  title?: string
  subtitle?: string
  description?: string
  className?: string
}

export default function ContactWithGlobe({
  title = "Contact us",
  subtitle = "Contact",
  description = "We are always looking for ways to improve our products and services. Contact us and let us know how we can help you.",
  className,
}: ContactWithGlobeProps) {
  const [sent, setSent] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [consent, setConsent] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    const form = e.currentTarget
    setSending(true)
    setError(false)
    try {
      const formData = new FormData(form)
      formData.append("access_key", WEB3FORMS_ACCESS_KEY)
      formData.append("subject", "New enquiry — nxtsoftwares.com")
      formData.append("from_name", "NXT Softwares Website")
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        form.reset()
        setConsent(false)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="contact"
      className={cn(
        "relative w-full overflow-hidden bg-nxt-section py-20",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center rounded-full border border-nxt-accent/25 bg-nxt-accent/10 px-4 py-1.5"
          >
            <span className="font-mono text-sm font-medium uppercase tracking-[0.25em] text-nxt-accent">
              {subtitle}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="font-display text-4xl font-bold tracking-[-0.03em] text-nxt-text md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="max-w-md text-base text-nxt-muted"
          >
            {description}
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-nxt-text">
                Get in touch
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-nxt-muted">
                Reach out via any channel below. We typically reply within one
                business day.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {CONTACT_LINKS.map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.1,
                    ease: smoothEase,
                  }}
                  className="group flex w-fit items-center gap-3 text-sm text-nxt-text2 transition-colors duration-200 hover:text-nxt-text"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-nxt-border bg-nxt-card transition-all duration-200 group-hover:border-nxt-accent/40 group-hover:bg-nxt-accent/10">
                    <Icon className="h-3.5 w-3.5 text-nxt-muted transition-colors duration-200 group-hover:text-nxt-accent" />
                  </div>
                  {label}
                </motion.a>
              ))}
            </div>

            <div className="relative h-52 overflow-hidden text-nxt-accent/50">
              <GlobeWireframe
                className="absolute left-0 top-0 aspect-square w-full max-w-full"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.45}
                strokeWidth={0.6}
                graticuleOpacity={0.12}
                rotateCities={["dubai", "london", "singapore", "new york"]}
                rotationSpeed={3600}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-nxt-section to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="flex flex-col gap-5 rounded-2xl border border-nxt-border bg-nxt-card p-6 sm:p-8"
          >
            <div>
              <h3 className="mb-0.5 text-lg font-semibold text-nxt-text">
                Send a message
              </h3>
              <p className="text-sm text-nxt-muted">
                Fill out the form and we&apos;ll get back to you promptly.
              </p>
            </div>

            <FormDots />

            {sent ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 160 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-nxt-accent/50 bg-nxt-accent/10"
                >
                  <Mail size={22} className="text-nxt-accent" />
                </motion.span>
                <p className="font-display text-2xl font-bold tracking-tight text-nxt-text">
                  Message sent.
                </p>
                <p className="max-w-xs text-sm leading-relaxed text-nxt-muted">
                  Thanks for reaching out — we&apos;ll get back to you within one
                  business day. Need a faster reply?{" "}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-nxt-accent underline underline-offset-4"
                  >
                    Message us on WhatsApp
                  </a>
                  .
                </p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-semibold uppercase tracking-widest text-nxt-muted"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Ahdeetai"
                    className="w-full rounded-xl border border-nxt-border bg-nxt-bg/50 px-4 py-2.5 text-sm text-nxt-text outline-none transition-all duration-200 placeholder:text-nxt-muted/60 focus:border-nxt-accent/60 focus:ring-2 focus:ring-nxt-accent/10"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-company"
                    className="text-xs font-semibold uppercase tracking-widest text-nxt-muted"
                  >
                    Company
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    placeholder="NXT Softwares"
                    className="w-full rounded-xl border border-nxt-border bg-nxt-bg/50 px-4 py-2.5 text-sm text-nxt-text outline-none transition-all duration-200 placeholder:text-nxt-muted/60 focus:border-nxt-accent/60 focus:ring-2 focus:ring-nxt-accent/10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="text-xs font-semibold uppercase tracking-widest text-nxt-muted"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-nxt-border bg-nxt-bg/50 px-4 py-2.5 text-sm text-nxt-text outline-none transition-all duration-200 placeholder:text-nxt-muted/60 focus:border-nxt-accent/60 focus:ring-2 focus:ring-nxt-accent/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold uppercase tracking-widest text-nxt-muted"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  placeholder="Type your message here"
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-nxt-border bg-nxt-bg/50 px-4 py-3 text-sm text-nxt-text outline-none transition-all duration-200 placeholder:text-nxt-muted/60 focus:border-nxt-accent/60 focus:ring-2 focus:ring-nxt-accent/10"
                />
              </div>

              {/* Consent */}
              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-nxt-muted">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded border border-nxt-border bg-nxt-bg/50 transition-colors checked:border-nxt-accent checked:bg-nxt-accent"
                />
                <span>
                  I agree to be contacted about my enquiry and accept the{" "}
                  <a
                    href={LEGAL_ROUTES.privacy}
                    className="underline underline-offset-2 hover:text-nxt-accent"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href={LEGAL_ROUTES.terms}
                    className="underline underline-offset-2 hover:text-nxt-accent"
                  >
                    Terms &amp; Conditions
                  </a>
                  .
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  type="submit"
                  disabled={sending}
                  className="group h-11 w-fit rounded-xl metal-surface px-8 text-sm font-semibold transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_40px_rgb(var(--nxt-glow)/0.15)] disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Submit"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
                {error && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs uppercase tracking-widest text-red-400"
                  >
                    Something went wrong — please try again or WhatsApp us.
                  </motion.span>
                )}
              </div>
            </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
