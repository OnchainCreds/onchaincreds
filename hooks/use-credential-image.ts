"use client"

import { useState, useCallback, useRef } from "react"

export interface CredentialData {
  fullName: string
  profession: string
  summary: string
  skills: string[]
  education: string
  experience: string
  references?: string
  photoUrl?: string
  template: string
  contact?: {
    phone: string
    email: string
    location: string
  }
}

export function useCredentialImage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const A4_WIDTH = 1588
  const A4_HEIGHT = 2246
  const LEFT_PANEL_WIDTH = 305
  const RIGHT_PANEL_START = LEFT_PANEL_WIDTH

  const generateCredentialImage = useCallback(async (data: CredentialData): Promise<string | null> => {
    setIsGenerating(true)

    try {
      const canvas = document.createElement("canvas")
      canvas.width = A4_WIDTH
      canvas.height = A4_HEIGHT

      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")

      const templates: Record<string, (ctx: CanvasRenderingContext2D, data: CredentialData, canvas: HTMLCanvasElement) => Promise<void>> = {
        "template-1": drawProfessionalBlueTemplate,
        "template-2": drawModernPurpleTemplate,
        "template-3": drawMinimalDarkTemplate,
        "template-4": drawExecutiveGoldTemplate,
        "template-5": drawTechGreenTemplate,
        "template-6": drawSunsetOrangeTemplate,
      }

      const templateDrawer = templates[data.template] || drawProfessionalBlueTemplate
      await templateDrawer(ctx, data, canvas)

      const imageData = canvas.toDataURL("image/png")
      setImageUrl(imageData)
      return imageData
    } catch (error) {
      console.error("Credential image generation error:", error)
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const dataURLToFile = useCallback((dataURL: string, fileName: string): File => {
    const arr = dataURL.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png"
    const bstr = atob(arr[1])
    const n = bstr.length
    const u8arr = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i)
    }
    return new File([u8arr], fileName, { type: mime })
  }, [])

  return {
    generateCredentialImage,
    imageUrl,
    isGenerating,
    canvasRef,
    dataURLToFile,
  }
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    try {
      img.src = src
    } catch {
      resolve(null)
    }
  })
}

async function drawProfessionalBlueTemplate(
  ctx: CanvasRenderingContext2D,
  data: CredentialData,
  canvas: HTMLCanvasElement
) {
  const W = canvas.width
  const H = canvas.height
  const LEFT_W = 305
  const RIGHT_START = LEFT_W
  const RIGHT_W = W - RIGHT_START

  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, "#f0f9ff")
  bgGrad.addColorStop(1, "#ffffff")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  const sideGrad = ctx.createLinearGradient(0, 0, LEFT_W, H)
  sideGrad.addColorStop(0, "#003d99")
  sideGrad.addColorStop(0.5, "#0052cc")
  sideGrad.addColorStop(1, "#0066ff")
  ctx.fillStyle = sideGrad
  ctx.fillRect(0, 0, LEFT_W, H)

  let yPos = 30

  if (data.photoUrl) {
    const img = await loadImage(data.photoUrl)
    if (img) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 100, 60, 0, Math.PI * 2)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 100, 58, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, LEFT_W / 2 - 58, 100 - 58, 116, 116)
      ctx.restore()
    }
  } else {
    ctx.fillStyle = "#0066ff"
    ctx.beginPath()
    ctx.arc(LEFT_W / 2, 100, 60, 0, Math.PI * 2)
    ctx.fill()

    const initials = data.fullName.split(" ").map(n => n[0]).join("")
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 40px -apple-system, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(initials, LEFT_W / 2, 113)
  }

  yPos = 200

  ctx.font = "bold 14px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.textAlign = "center"
  ctx.fillText("CORE SKILLS", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "12px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#e0f2ff"
  const skills = data.skills.slice(0, 6)
  skills.forEach((skill) => {
    const lines = wrapText(ctx, skill, LEFT_W - 30, 12)
    lines.forEach((line) => {
      if (yPos < H - 120) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 20
      }
    })
  })

  yPos += 18

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 14px -apple-system, system-ui, sans-serif"
  ctx.fillText("CONTACT", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "11px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#e0f2ff"
  ctx.textAlign = "center"

  if (data.contact?.email) {
    const emailLines = wrapText(ctx, data.contact.email, LEFT_W - 25, 11)
    emailLines.forEach((line) => {
      if (yPos < H - 100) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 18
      }
    })
  }
  if (data.contact?.phone) {
    if (yPos < H - 100) {
      ctx.fillText(data.contact.phone, LEFT_W / 2, yPos)
      yPos += 18
    }
  }
  if (data.contact?.location) {
    const locLines = wrapText(ctx, data.contact.location, LEFT_W - 25, 11)
    locLines.forEach((line) => {
      if (yPos < H - 100) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 18
      }
    })
  }

  // RIGHT PANEL
  let rYPos = 25

  ctx.textAlign = "left"
  ctx.fillStyle = "#003d99"
  ctx.font = "bold 50px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.fullName, RIGHT_START + 30, rYPos + 50)

  ctx.fillStyle = "#0066ff"
  ctx.font = "32px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.profession, RIGHT_START + 30, rYPos + 100)

  ctx.strokeStyle = "#66d4ff"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(RIGHT_START + 30, rYPos + 120)
  ctx.lineTo(RIGHT_START + RIGHT_W - 30, rYPos + 120)
  ctx.stroke()

  rYPos = 150

  if (data.summary?.trim()) {
    ctx.fillStyle = "#003d99"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL PROFILE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1a2a3a"
    ctx.font = "13px -apple-system, system-ui, sans-serif"
    const sumLines = wrapText(ctx, data.summary, RIGHT_W - 80, 13)
    sumLines.slice(0, 5).forEach((line) => {
      if (rYPos < H - 200) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 18
      }
    })
    rYPos += 15
  }

  if (data.experience?.trim()) {
    ctx.fillStyle = "#003d99"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL EXPERIENCE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1a2a3a"
    const expLines = wrapText(ctx, data.experience, RIGHT_W - 90, 12)
    let expCount = 0
    const expStartY = rYPos

    expLines.slice(0, 16).forEach((line) => {
      if (rYPos < H - 150 && expCount < 16) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })

    rYPos += 15
  }

  if (data.education?.trim()) {
    ctx.fillStyle = "#003d99"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("EDUCATION", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1a2a3a"
    const eduLines = wrapText(ctx, data.education, RIGHT_W - 90, 12)
    let eduCount = 0

    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })

    rYPos += 15
  }

  if (data.references?.trim()) {
    ctx.fillStyle = "#003d99"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("REFERENCES", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1a2a3a"
    ctx.font = "12px -apple-system, system-ui, sans-serif"
    const refLines = wrapText(ctx, data.references, RIGHT_W - 80, 12)
    let refCount = 0
    refLines.forEach((line) => {
      if (rYPos < H - 80 && refCount < 10) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 17
        refCount++
      }
    })
  }

  ctx.fillStyle = "#003d99"
  ctx.fillRect(0, H - 50, W, 50)

  ctx.fillStyle = "#66d4ff"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("✓ Verified by OnchainCreds", W / 2, H - 18)
}

async function drawModernPurpleTemplate(
  ctx: CanvasRenderingContext2D,
  data: CredentialData,
  canvas: HTMLCanvasElement
) {
  const W = canvas.width
  const H = canvas.height
  const LEFT_W = 305
  const RIGHT_START = LEFT_W
  const RIGHT_W = W - RIGHT_START

  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, "#faf5ff")
  bgGrad.addColorStop(1, "#ffffff")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  const sideGrad = ctx.createLinearGradient(0, 0, LEFT_W, H)
  sideGrad.addColorStop(0, "#6b21a8")
  sideGrad.addColorStop(0.5, "#9333ea")
  sideGrad.addColorStop(1, "#b83ef5")
  ctx.fillStyle = sideGrad
  ctx.fillRect(0, 0, LEFT_W, H)

  let yPos = 40

  if (data.photoUrl) {
    const img = await loadImage(data.photoUrl)
    if (img) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 120, 70, 0, Math.PI * 2)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 5
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 120, 67, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, LEFT_W / 2 - 67, 120 - 67, 134, 134)
      ctx.restore()
    }
  } else {
    ctx.fillStyle = "#e9d5ff"
    ctx.beginPath()
    ctx.arc(LEFT_W / 2, 120, 70, 0, Math.PI * 2)
    ctx.fill()

    const initials = data.fullName.split(" ").map(n => n[0]).join("")
    ctx.fillStyle = "#6b21a8"
    ctx.font = "bold 48px -apple-system, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(initials, LEFT_W / 2, 135)
  }

  yPos = 240

  ctx.font = "bold 14px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.textAlign = "center"
  ctx.fillText("CORE SKILLS", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "12px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#f3e8ff"
  const skills = data.skills.slice(0, 6)
  skills.forEach((skill) => {
    const lines = wrapText(ctx, skill, LEFT_W - 30, 12)
    lines.forEach((line) => {
      if (yPos < H - 140) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 20
      }
    })
  })

  yPos += 18

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 14px -apple-system, system-ui, sans-serif"
  ctx.fillText("CONTACT", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "11px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#f3e8ff"
  ctx.textAlign = "left"

  if (data.contact?.email) {
    ctx.fillText("✉ " + data.contact.email.split("@")[0], 20, yPos)
    yPos += 22
  }
  if (data.contact?.phone) {
    ctx.fillText("☎ " + data.contact.phone.slice(-7), 20, yPos)
    yPos += 22
  }
  if (data.contact?.location) {
    ctx.fillText("📍 " + data.contact.location, 20, yPos)
    yPos += 22
  }

  let rYPos = 40

  ctx.textAlign = "left"
  ctx.fillStyle = "#6b21a8"
  ctx.font = "bold 50px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.fullName, RIGHT_START + 30, rYPos + 50)

  ctx.fillStyle = "#9333ea"
  ctx.font = "32px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.profession, RIGHT_START + 30, rYPos + 100)

  ctx.strokeStyle = "#d946ef"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(RIGHT_START + 30, rYPos + 120)
  ctx.lineTo(RIGHT_START + RIGHT_W - 30, rYPos + 120)
  ctx.stroke()

  rYPos = 150

  if (data.summary) {
    ctx.fillStyle = "#6b21a8"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL PROFILE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1e1b2a"
    ctx.font = "13px -apple-system, system-ui, sans-serif"
    const sumLines = wrapText(ctx, data.summary, RIGHT_W - 80, 13)
    sumLines.slice(0, 5).forEach((line) => {
      if (rYPos < H - 200) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 18
      }
    })
    rYPos += 15
  }

  if (data.experience) {
    ctx.fillStyle = "#6b21a8"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL EXPERIENCE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#f3e8ff"
    const expLines = wrapText(ctx, data.experience, RIGHT_W - 90, 12)
    let expCount = 0
    const expStartY = rYPos

    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })

    const expHeight = expCount * 17 + 25
    ctx.fillStyle = "rgba(243, 232, 255, 0.9)"
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, expStartY - 18, RIGHT_W - 60, expHeight, 8)
    ctx.fill()

    ctx.fillStyle = "#1e1b2a"
    rYPos = expStartY
    expCount = 0
    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })
    rYPos += 20
  }

  if (data.education) {
    ctx.fillStyle = "#6b21a8"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("EDUCATION", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#f3e8ff"
    const eduLines = wrapText(ctx, data.education, RIGHT_W - 90, 12)
    let eduCount = 0
    const eduStartY = rYPos

    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })

    const eduHeight = eduCount * 17 + 25
    ctx.fillStyle = "rgba(243, 232, 255, 0.9)"
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, eduStartY - 18, RIGHT_W - 60, eduHeight, 8)
    ctx.fill()

    ctx.fillStyle = "#1e1b2a"
    rYPos = eduStartY
    eduCount = 0
    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })
    rYPos += 20
  }

  if (data.references) {
    ctx.fillStyle = "#6b21a8"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("REFERENCES", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1e1b2a"
    ctx.font = "12px -apple-system, system-ui, sans-serif"
    const refLines = wrapText(ctx, data.references, RIGHT_W - 80, 12)
    let refCount = 0
    refLines.forEach((line) => {
      if (rYPos < H - 80 && refCount < 10) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 17
        refCount++
      }
    })
  }

  ctx.fillStyle = "#6b21a8"
  ctx.fillRect(0, H - 50, W, 50)

  ctx.fillStyle = "#d946ef"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("✓ Verified by OnchainCreds", W / 2, H - 18)
}

async function drawMinimalDarkTemplate(
  ctx: CanvasRenderingContext2D,
  data: CredentialData,
  canvas: HTMLCanvasElement
) {
  const W = canvas.width
  const H = canvas.height
  const LEFT_W = 305
  const RIGHT_START = LEFT_W
  const RIGHT_W = W - RIGHT_START

  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, "#0f172a")
  bgGrad.addColorStop(1, "#1e293b")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = "#1e293b"
  ctx.fillRect(0, 0, LEFT_W, H)

  ctx.strokeStyle = "#475569"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(LEFT_W, 0)
  ctx.lineTo(LEFT_W, H)
  ctx.stroke()

  let yPos = 40

  if (data.photoUrl) {
    const img = await loadImage(data.photoUrl)
    if (img) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 120, 70, 0, Math.PI * 2)
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 120, 67, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, LEFT_W / 2 - 67, 120 - 67, 134, 134)
      ctx.restore()
    }
  } else {
    ctx.fillStyle = "#334155"
    ctx.beginPath()
    ctx.arc(LEFT_W / 2, 120, 70, 0, Math.PI * 2)
    ctx.fill()

    const initials = data.fullName.split(" ").map(n => n[0]).join("")
    ctx.fillStyle = "#cbd5e1"
    ctx.font = "bold 48px -apple-system, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(initials, LEFT_W / 2, 135)
  }

  yPos = 240

  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#e2e8f0"
  ctx.textAlign = "center"
  ctx.fillText("SKILLS", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "11px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#cbd5e1"
  const skills = data.skills.slice(0, 6)
  skills.forEach((skill) => {
    const lines = wrapText(ctx, skill, LEFT_W - 30, 11)
    lines.forEach((line) => {
      if (yPos < H - 140) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 20
      }
    })
  })

  yPos += 18

  ctx.fillStyle = "#e2e8f0"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.fillText("CONTACT", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "10px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#94a3b8"
  ctx.textAlign = "left"

  if (data.contact?.email) {
    ctx.fillText(data.contact.email.split("@")[0], 15, yPos)
    yPos += 22
  }
  if (data.contact?.phone) {
    ctx.fillText(data.contact.phone.slice(-7), 15, yPos)
    yPos += 22
  }
  if (data.contact?.location) {
    ctx.fillText(data.contact.location, 15, yPos)
    yPos += 22
  }

  let rYPos = 40

  ctx.textAlign = "left"
  ctx.fillStyle = "#f1f5f9"
  ctx.font = "bold 50px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.fullName, RIGHT_START + 30, rYPos + 50)

  ctx.fillStyle = "#cbd5e1"
  ctx.font = "32px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.profession, RIGHT_START + 30, rYPos + 100)

  ctx.strokeStyle = "#64748b"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(RIGHT_START + 30, rYPos + 120)
  ctx.lineTo(RIGHT_START + RIGHT_W - 30, rYPos + 120)
  ctx.stroke()

  rYPos = 150

  if (data.summary) {
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFILE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#cbd5e1"
    ctx.font = "13px -apple-system, system-ui, sans-serif"
    const sumLines = wrapText(ctx, data.summary, RIGHT_W - 80, 13)
    sumLines.slice(0, 5).forEach((line) => {
      if (rYPos < H - 200) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 18
      }
    })
    rYPos += 15
  }

  if (data.experience) {
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("EXPERIENCE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#334155"
    const expLines = wrapText(ctx, data.experience, RIGHT_W - 90, 12)
    let expCount = 0
    const expStartY = rYPos

    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })

    const expHeight = expCount * 17 + 25
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, expStartY - 18, RIGHT_W - 60, expHeight, 8)
    ctx.fill()

    ctx.fillStyle = "#cbd5e1"
    rYPos = expStartY
    expCount = 0
    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })
    rYPos += 20
  }

  if (data.education) {
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("EDUCATION", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#334155"
    const eduLines = wrapText(ctx, data.education, RIGHT_W - 90, 12)
    let eduCount = 0
    const eduStartY = rYPos

    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })

    const eduHeight = eduCount * 17 + 25
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, eduStartY - 18, RIGHT_W - 60, eduHeight, 8)
    ctx.fill()

    ctx.fillStyle = "#cbd5e1"
    rYPos = eduStartY
    eduCount = 0
    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })
    rYPos += 20
  }

  if (data.references) {
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("REFERENCES", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#cbd5e1"
    ctx.font = "12px -apple-system, system-ui, sans-serif"
    const refLines = wrapText(ctx, data.references, RIGHT_W - 80, 12)
    let refCount = 0
    refLines.forEach((line) => {
      if (rYPos < H - 80 && refCount < 10) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 17
        refCount++
      }
    })
  }

  ctx.fillStyle = "#1e293b"
  ctx.fillRect(0, H - 50, W, 50)

  ctx.fillStyle = "#64748b"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("✓ Verified by OnchainCreds", W / 2, H - 18)
}

async function drawExecutiveGoldTemplate(
  ctx: CanvasRenderingContext2D,
  data: CredentialData,
  canvas: HTMLCanvasElement
) {
  const W = canvas.width
  const H = canvas.height
  const LEFT_W = 305
  const RIGHT_START = LEFT_W
  const RIGHT_W = W - RIGHT_START

  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, "#fefcf8")
  bgGrad.addColorStop(1, "#fffbf0")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  const sideGrad = ctx.createLinearGradient(0, 0, LEFT_W, H)
  sideGrad.addColorStop(0, "#78350f")
  sideGrad.addColorStop(0.5, "#a16207")
  sideGrad.addColorStop(1, "#d97706")
  ctx.fillStyle = sideGrad
  ctx.fillRect(0, 0, LEFT_W, H)

  let yPos = 30

  if (data.photoUrl) {
    const img = await loadImage(data.photoUrl)
    if (img) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 100, 60, 0, Math.PI * 2)
      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 100, 58, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, LEFT_W / 2 - 58, 100 - 58, 116, 116)
      ctx.restore()
    }
  } else {
    ctx.fillStyle = "#fbbf24"
    ctx.beginPath()
    ctx.arc(LEFT_W / 2, 100, 60, 0, Math.PI * 2)
    ctx.fill()

    const initials = data.fullName.split(" ").map(n => n[0]).join("")
    ctx.fillStyle = "#78350f"
    ctx.font = "bold 40px -apple-system, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(initials, LEFT_W / 2, 113)
  }

  yPos = 200

  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.textAlign = "center"
  ctx.fillText("SKILLS", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "11px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#fcd34d"
  const skills = data.skills.slice(0, 6)
  skills.forEach((skill) => {
    const lines = wrapText(ctx, skill, LEFT_W - 30, 11)
    lines.forEach((line) => {
      if (yPos < H - 120) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 20
      }
    })
  })

  yPos += 18

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.fillText("CONTACT", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "10px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#fcd34d"
  ctx.textAlign = "center"

  if (data.contact?.email) {
    const emailLines = wrapText(ctx, data.contact.email, LEFT_W - 25, 10)
    emailLines.forEach((line) => {
      if (yPos < H - 100) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 16
      }
    })
  }
  if (data.contact?.phone) {
    if (yPos < H - 100) {
      ctx.fillText(data.contact.phone, LEFT_W / 2, yPos)
      yPos += 16
    }
  }
  if (data.contact?.location) {
    const locLines = wrapText(ctx, data.contact.location, LEFT_W - 25, 10)
    locLines.forEach((line) => {
      if (yPos < H - 100) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 16
      }
    })
  }

  let rYPos = 25

  ctx.textAlign = "left"
  ctx.fillStyle = "#a16207"
  ctx.font = "bold 50px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.fullName, RIGHT_START + 30, rYPos + 50)

  ctx.fillStyle = "#d97706"
  ctx.font = "32px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.profession, RIGHT_START + 30, rYPos + 100)

  ctx.strokeStyle = "#fbbf24"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(RIGHT_START + 30, rYPos + 120)
  ctx.lineTo(RIGHT_START + RIGHT_W - 30, rYPos + 120)
  ctx.stroke()

  rYPos = 150

  if (data.summary?.trim()) {
    ctx.fillStyle = "#a16207"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL PROFILE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1f2937"
    ctx.font = "13px -apple-system, system-ui, sans-serif"
    const sumLines = wrapText(ctx, data.summary, RIGHT_W - 80, 13)
    sumLines.slice(0, 5).forEach((line) => {
      if (rYPos < H - 200) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 18
      }
    })
    rYPos += 15
  }

  if (data.experience?.trim()) {
    ctx.fillStyle = "#a16207"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL EXPERIENCE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#ffffff"
    const expLines = wrapText(ctx, data.experience, RIGHT_W - 90, 12)
    let expCount = 0
    const expStartY = rYPos

    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })

    const expHeight = expCount * 17 + 25
    ctx.fillStyle = "rgba(254, 243, 235, 0.95)"
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, expStartY - 18, RIGHT_W - 60, expHeight, 8)
    ctx.fill()

    ctx.fillStyle = "#1f2937"
    rYPos = expStartY
    expCount = 0
    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })
    rYPos += 20
  }

  if (data.education?.trim()) {
    ctx.fillStyle = "#a16207"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("EDUCATION", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#ffffff"
    const eduLines = wrapText(ctx, data.education, RIGHT_W - 90, 12)
    let eduCount = 0
    const eduStartY = rYPos

    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })

    const eduHeight = eduCount * 17 + 25
    ctx.fillStyle = "rgba(254, 243, 235, 0.95)"
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, eduStartY - 18, RIGHT_W - 60, eduHeight, 8)
    ctx.fill()

    ctx.fillStyle = "#1f2937"
    rYPos = eduStartY
    eduCount = 0
    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })
    rYPos += 20
  }

  if (data.references?.trim()) {
    ctx.fillStyle = "#a16207"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("REFERENCES", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1f2937"
    ctx.font = "12px -apple-system, system-ui, sans-serif"
    const refLines = wrapText(ctx, data.references, RIGHT_W - 80, 12)
    let refCount = 0
    refLines.forEach((line) => {
      if (rYPos < H - 80 && refCount < 10) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 17
        refCount++
      }
    })
  }

  ctx.fillStyle = "#a16207"
  ctx.fillRect(0, H - 50, W, 50)

  ctx.fillStyle = "#fbbf24"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("✓ Verified by OnchainCreds", W / 2, H - 18)
}

async function drawTechGreenTemplate(
  ctx: CanvasRenderingContext2D,
  data: CredentialData,
  canvas: HTMLCanvasElement
) {
  const W = canvas.width
  const H = canvas.height
  const LEFT_W = 305
  const RIGHT_START = LEFT_W
  const RIGHT_W = W - RIGHT_START

  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, "#0f172a")
  bgGrad.addColorStop(1, "#1e293b")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = "#0f172a"
  ctx.fillRect(0, 0, LEFT_W, H)

  ctx.fillStyle = "#10b981"
  ctx.fillRect(LEFT_W - 3, 0, 3, H)

  let yPos = 40

  if (data.photoUrl) {
    const img = await loadImage(data.photoUrl)
    if (img) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 120, 70, 0, Math.PI * 2)
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 120, 67, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, LEFT_W / 2 - 67, 120 - 67, 134, 134)
      ctx.restore()
    }
  } else {
    ctx.fillStyle = "#10b981"
    ctx.beginPath()
    ctx.arc(LEFT_W / 2, 120, 70, 0, Math.PI * 2)
    ctx.fill()

    const initials = data.fullName.split(" ").map(n => n[0]).join("")
    ctx.fillStyle = "#0f172a"
    ctx.font = "bold 48px -apple-system, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(initials, LEFT_W / 2, 135)
  }

  yPos = 240

  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#10b981"
  ctx.textAlign = "center"
  ctx.fillText("TECH STACK", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "11px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#cbd5e1"
  const skills = data.skills.slice(0, 6)
  skills.forEach((skill) => {
    const lines = wrapText(ctx, skill, LEFT_W - 30, 11)
    lines.forEach((line) => {
      if (yPos < H - 140) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 20
      }
    })
  })

  yPos += 18

  ctx.fillStyle = "#10b981"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.fillText("CONTACT", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "10px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#a7f3d0"
  ctx.textAlign = "left"

  if (data.contact?.email) {
    ctx.fillText(data.contact.email.split("@")[0], 15, yPos)
    yPos += 22
  }
  if (data.contact?.phone) {
    ctx.fillText(data.contact.phone.slice(-7), 15, yPos)
    yPos += 22
  }
  if (data.contact?.location) {
    ctx.fillText(data.contact.location, 15, yPos)
    yPos += 22
  }

  let rYPos = 40

  ctx.textAlign = "left"
  ctx.fillStyle = "#10b981"
  ctx.font = "bold 50px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.fullName, RIGHT_START + 30, rYPos + 50)

  ctx.fillStyle = "#6ee7b7"
  ctx.font = "32px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.profession, RIGHT_START + 30, rYPos + 100)

  ctx.strokeStyle = "#10b981"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(RIGHT_START + 30, rYPos + 120)
  ctx.lineTo(RIGHT_START + RIGHT_W - 30, rYPos + 120)
  ctx.stroke()

  rYPos = 150

  if (data.summary) {
    ctx.fillStyle = "#10b981"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("ABOUT", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#cbd5e1"
    ctx.font = "13px -apple-system, system-ui, sans-serif"
    const sumLines = wrapText(ctx, data.summary, RIGHT_W - 80, 13)
    sumLines.slice(0, 5).forEach((line) => {
      if (rYPos < H - 200) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 18
      }
    })
    rYPos += 15
  }

  if (data.experience) {
    ctx.fillStyle = "#10b981"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL EXPERIENCE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1e293b"
    const expLines = wrapText(ctx, data.experience, RIGHT_W - 90, 12)
    let expCount = 0
    const expStartY = rYPos

    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })

    const expHeight = expCount * 17 + 25
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, expStartY - 18, RIGHT_W - 60, expHeight, 8)
    ctx.fill()

    ctx.strokeStyle = "#14b8a6"
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = "#cbd5e1"
    rYPos = expStartY
    expCount = 0
    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })
    rYPos += 20
  }

  if (data.education) {
    ctx.fillStyle = "#10b981"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("EDUCATION", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1e293b"
    const eduLines = wrapText(ctx, data.education, RIGHT_W - 90, 12)
    let eduCount = 0
    const eduStartY = rYPos

    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })

    const eduHeight = eduCount * 17 + 25
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, eduStartY - 18, RIGHT_W - 60, eduHeight, 8)
    ctx.fill()

    ctx.strokeStyle = "#14b8a6"
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = "#cbd5e1"
    rYPos = eduStartY
    eduCount = 0
    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })
    rYPos += 20
  }

  if (data.references) {
    ctx.fillStyle = "#10b981"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("REFERENCES", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#cbd5e1"
    ctx.font = "12px -apple-system, system-ui, sans-serif"
    const refLines = wrapText(ctx, data.references, RIGHT_W - 80, 12)
    let refCount = 0
    refLines.forEach((line) => {
      if (rYPos < H - 80 && refCount < 10) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 17
        refCount++
      }
    })
  }

  ctx.fillStyle = "#10b981"
  ctx.fillRect(0, H - 50, W, 50)

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("✓ Verified by OnchainCreds", W / 2, H - 18)
}

async function drawSunsetOrangeTemplate(
  ctx: CanvasRenderingContext2D,
  data: CredentialData,
  canvas: HTMLCanvasElement
) {
  const W = canvas.width
  const H = canvas.height
  const LEFT_W = 305
  const RIGHT_START = LEFT_W
  const RIGHT_W = W - RIGHT_START

  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, "#fffbeb")
  bgGrad.addColorStop(1, "#fef3c7")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)

  const sideGrad = ctx.createLinearGradient(0, 0, LEFT_W, H)
  sideGrad.addColorStop(0, "#9a3412")
  sideGrad.addColorStop(0.5, "#dc2626")
  sideGrad.addColorStop(1, "#f97316")
  ctx.fillStyle = sideGrad
  ctx.fillRect(0, 0, LEFT_W, H)

  let yPos = 40

  if (data.photoUrl) {
    const img = await loadImage(data.photoUrl)
    if (img) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 120, 70, 0, Math.PI * 2)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 5
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(LEFT_W / 2, 120, 67, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, LEFT_W / 2 - 67, 120 - 67, 134, 134)
      ctx.restore()
    }
  } else {
    ctx.fillStyle = "#fed7aa"
    ctx.beginPath()
    ctx.arc(LEFT_W / 2, 120, 70, 0, Math.PI * 2)
    ctx.fill()

    const initials = data.fullName.split(" ").map(n => n[0]).join("")
    ctx.fillStyle = "#7c2d12"
    ctx.font = "bold 48px -apple-system, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(initials, LEFT_W / 2, 135)
  }

  yPos = 240

  ctx.font = "bold 14px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.textAlign = "center"
  ctx.fillText("CORE SKILLS", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "12px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#fed7aa"
  const skills = data.skills.slice(0, 6)
  skills.forEach((skill) => {
    const lines = wrapText(ctx, skill, LEFT_W - 30, 12)
    lines.forEach((line) => {
      if (yPos < H - 140) {
        ctx.fillText(line, LEFT_W / 2, yPos)
        yPos += 20
      }
    })
  })

  yPos += 18

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 14px -apple-system, system-ui, sans-serif"
  ctx.fillText("CONTACT", LEFT_W / 2, yPos)
  yPos += 26

  ctx.font = "11px -apple-system, system-ui, sans-serif"
  ctx.fillStyle = "#fed7aa"
  ctx.textAlign = "left"

  if (data.contact?.email) {
    ctx.fillText("✉ " + data.contact.email.split("@")[0], 20, yPos)
    yPos += 22
  }
  if (data.contact?.phone) {
    ctx.fillText("☎ " + data.contact.phone.slice(-7), 20, yPos)
    yPos += 22
  }
  if (data.contact?.location) {
    ctx.fillText("📍 " + data.contact.location, 20, yPos)
    yPos += 22
  }

  let rYPos = 40

  ctx.textAlign = "left"
  ctx.fillStyle = "#9a3412"
  ctx.font = "bold 50px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.fullName, RIGHT_START + 30, rYPos + 50)

  ctx.fillStyle = "#dc2626"
  ctx.font = "32px -apple-system, system-ui, sans-serif"
  ctx.fillText(data.profession, RIGHT_START + 30, rYPos + 100)

  ctx.strokeStyle = "#f97316"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(RIGHT_START + 30, rYPos + 120)
  ctx.lineTo(RIGHT_START + RIGHT_W - 30, rYPos + 120)
  ctx.stroke()

  rYPos = 150

  if (data.summary) {
    ctx.fillStyle = "#9a3412"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL PROFILE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1f2937"
    ctx.font = "13px -apple-system, system-ui, sans-serif"
    const sumLines = wrapText(ctx, data.summary, RIGHT_W - 80, 13)
    sumLines.slice(0, 5).forEach((line) => {
      if (rYPos < H - 200) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 18
      }
    })
    rYPos += 15
  }

  if (data.experience) {
    ctx.fillStyle = "#9a3412"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("PROFESSIONAL EXPERIENCE", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#fed7aa"
    const expLines = wrapText(ctx, data.experience, RIGHT_W - 90, 12)
    let expCount = 0
    const expStartY = rYPos

    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })

    const expHeight = expCount * 17 + 25
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, expStartY - 18, RIGHT_W - 60, expHeight, 8)
    ctx.fill()

    ctx.fillStyle = "#1f2937"
    rYPos = expStartY
    expCount = 0
    expLines.slice(0, 14).forEach((line) => {
      if (rYPos < H - 150 && expCount < 14) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        expCount++
      }
    })
    rYPos += 20
  }

  if (data.education) {
    ctx.fillStyle = "#9a3412"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("EDUCATION", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#fed7aa"
    const eduLines = wrapText(ctx, data.education, RIGHT_W - 90, 12)
    let eduCount = 0
    const eduStartY = rYPos

    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })

    const eduHeight = eduCount * 17 + 25
    ctx.beginPath()
    ctx.roundRect(RIGHT_START + 30, eduStartY - 18, RIGHT_W - 60, eduHeight, 8)
    ctx.fill()

    ctx.fillStyle = "#1f2937"
    rYPos = eduStartY
    eduCount = 0
    eduLines.slice(0, 12).forEach((line) => {
      if (rYPos < H - 120 && eduCount < 12) {
        ctx.fillText(line, RIGHT_START + 40, rYPos)
        rYPos += 17
        eduCount++
      }
    })
    rYPos += 20
  }

  if (data.references) {
    ctx.fillStyle = "#9a3412"
    ctx.font = "bold 17px -apple-system, system-ui, sans-serif"
    ctx.fillText("REFERENCES", RIGHT_START + 30, rYPos)
    rYPos += 32

    ctx.fillStyle = "#1f2937"
    ctx.font = "12px -apple-system, system-ui, sans-serif"
    const refLines = wrapText(ctx, data.references, RIGHT_W - 80, 12)
    let refCount = 0
    refLines.forEach((line) => {
      if (rYPos < H - 80 && refCount < 10) {
        ctx.fillText(line, RIGHT_START + 30, rYPos)
        rYPos += 17
        refCount++
      }
    })
  }

  ctx.fillStyle = "#dc2626"
  ctx.fillRect(0, H - 50, W, 50)

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 13px -apple-system, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("✓ Verified by OnchainCreds", W / 2, H - 18)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? " " : "") + word
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  })

  if (currentLine) lines.push(currentLine)
  return lines
}
