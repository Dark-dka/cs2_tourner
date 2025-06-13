"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Gamepad2,
  Clock,
  Zap,
  Flame,
  Crosshair,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Crown,
  ArrowRight,
  Swords,
  Plus,
  Minus,
  UserPlus,
} from "lucide-react"
import SuccessModal from "@/components/success-modal"

// API configuration
const API_BASE_URL = "https://turnir.utu-ranch.uz/api"

// Interface qo'shish
interface RegistrationResponse {
  success: boolean
  message: string
  registration_id: number
  status: string
  player_info: {
    name: string
    email: string
    game_nickname: string
    is_captain: boolean
    team_name?: string
  }
  tournament_info: {
    name: string
    start_date: string
    registration_deadline: string
  }
}

interface TournamentStats {
  tournament_name: string
  total_registrations: number
  total_teams: number
  total_players: number
  prize_pool: number
  first_prize: number
  second_prize: number
  third_prize: number
  registration_deadline: string
  start_date: string
  end_date: string
  teams: Array<{
    id: number
    name: string
    captain_name: string
    members_count: number
    members: Array<{
      name: string
      game_nickname: string
      is_captain: boolean
    }>
  }>
  recent_players: Array<{
    name: string
    game_nickname: string
    team_name: string
    is_captain: boolean
    registration_date: string
  }>
}

// Jamoa a'zosi interfeysi
interface TeamMember {
  id: string
  firstName: string
  lastName: string
  gameNickname: string
  email: string
  phone: string
}

export default function TournamentRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    university: "Urganch Ranch texnologiya universiteti",
    studentId: "",
    gameNickname: "CS2",
    steamId: "",
    rank: "",
    experience: "",
    teamName: "",
    additionalInfo: "",
  })

  // Jamoa a'zolari uchun state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [showTeamMembers, setShowTeamMembers] = useState(false)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [tournamentStats, setTournamentStats] = useState<TournamentStats | null>(null)

  // State qo'shish
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [registrationResponse, setRegistrationResponse] = useState<RegistrationResponse | null>(null)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Fetch tournament stats
    fetchTournamentStats()

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Jamoa nomi o'zgarganda jamoa a'zolari formasi ko'rsatilsin
  useEffect(() => {
    if (formData.teamName.trim()) {
      setShowTeamMembers(true)
    } else {
      setShowTeamMembers(false)
      setTeamMembers([])
    }
  }, [formData.teamName])

  const fetchTournamentStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tournaments/active/stats/`)
      if (response.ok) {
        const stats = await response.json()
        setTournamentStats(stats)
      }
    } catch (error) {
      console.error("Error fetching tournament stats:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Jamoa a'zosini qo'shish
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      firstName: "",
      lastName: "",
      gameNickname: "",
      email: "",
      phone: "",
    }
    setTeamMembers([...teamMembers, newMember])
  }

  // Jamoa a'zosini o'chirish
  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  // Jamoa a'zosi ma'lumotlarini yangilash
  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  // handleSubmit funksiyasini yangilash
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        university: formData.university,
        student_id: formData.studentId,
        game_nickname: formData.gameNickname,
        steam_id: formData.steamId,
        rank: formData.rank,
        experience: formData.experience,
        team_name: formData.teamName,
        additional_info: formData.additionalInfo,
        // Jamoa a'zolari ma'lumotlarini qo'shish
        team_members: teamMembers.map((member) => ({
          first_name: member.firstName,
          last_name: member.lastName,
          game_nickname: member.gameNickname,
          email: member.email,
          phone: member.phone,
        })),
      }

      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setRegistrationResponse(result)
        setSuccessModalOpen(true)

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          university: "Urganch Ranch texnologiya universiteti",
          studentId: "",
          gameNickname: "CS2",
          steamId: "",
          rank: "",
          experience: "",
          teamName: "",
          additionalInfo: "",
        })
        setTeamMembers([])
        setShowTeamMembers(false)

        // Refresh stats
        fetchTournamentStats()
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setSubmitStatus({
        type: "error",
        message: "Server bilan bog'lanishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const tournamentRules = [
    "Jamoalar 5v5 formatda o'ynaydi, lekin jamoada 7 kishigacha bo'lishi mumkin.",
    "Barcha ishtirokchilar Ranch universiteti talabalari bo'lishi kerak.",
    "O'yin davomida adolatli o'ynash talab qilinadi; har qanday cheat yoki hackdan foydalanish diskvalifikatsiyaga olib keladi.",
    "Turnir onlayn o'tkaziladi, shuning uchun barqaror internet aloqasi zarur.",
    "Har bir o'yinchi o'zining Steam ID'sini taqdim etishi va CS2 o'yiniga ega bo'lishi kerak.",
    "Ro'yxatdan o'tish 10 Mart 2025, 23:59 da yakunlanadi.",
    "Turnir 15-17 Mart 2025 kunlari o'tkaziladi.",
    "Mukofotlar: 1-o'rin - 50,000 so'm, 2-o'rin - 30,000 so'm, 3-o'rin - 20,000 so'm.",
  ]

  // Real ma'lumotlarni ko'rsatish uchun yangilash
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Tournament info cardida real ma'lumotlarni ko'rsatish
  const tournamentInfo = [
    {
      icon: Calendar,
      title: "O'tkazilish sanasi",
      desc: tournamentStats ? formatDate(tournamentStats.start_date) : "15-17 Mart 2025",
      color: "text-blue-400",
    },
    { icon: Users, title: "Format", desc: "5v5, jamoada 7 kishigacha", color: "text-green-400" },
    {
      icon: Trophy,
      title: "Mukofotlar",
      desc: tournamentStats
        ? [
          `1-o'rin: ${tournamentStats.first_prize.toLocaleString()} so'm`,
          `2-o'rin: ${tournamentStats.second_prize.toLocaleString()} so'm`,
          `3-o'rin: ${tournamentStats.third_prize.toLocaleString()} so'm`,
        ]
        : ["1-o'rin: 50,000 so'm", "2-o'rin: 30,000 so'm", "3-o'rin: 20,000 so'm"],
      color: "text-yellow-400",
    },
    {
      icon: Clock,
      title: "Ro'yxatdan o'tish muddati",
      desc: tournamentStats ? formatDate(tournamentStats.registration_deadline) : "10 Mart 2025, 23:59",
      color: "text-red-400",
    },
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-red-900/20 to-yellow-900/20" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,165,0,0.15), transparent 40%)`,
          }}
        />
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,165,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,165,0,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
              animation: "grid-move 20s linear infinite",
            }}
          />
        </div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 via-red-600/60 to-orange-700/80" />

        <div
          className={`relative container mx-auto px-4 py-20 text-center text-white transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
        >
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="relative p-6 bg-black/50 rounded-full backdrop-blur-sm border border-orange-500/50">
                <Crosshair className="w-16 h-16 text-orange-400 animate-spin-slow" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
            CS2 CHEMPIONATI
          </h1>
          <div className="text-2xl md:text-3xl mb-8 text-orange-100 font-light tracking-wide drop-shadow-lg">
            COUNTER-STRIKE 2 BO'YICHA TALABALAR TURNIRI
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base">
            {[
              {
                icon: Trophy,
                text: `Mukofot fondi: ${tournamentStats?.prize_pool?.toLocaleString() || "100,000"} so'm`,
                color: "from-yellow-400 to-orange-500",
              },
              { icon: Calendar, text: "15-17 Mart 2025", color: "from-blue-400 to-purple-500" },
              { icon: MapPin, text: "Onlayn turnir", color: "from-green-400 to-teal-500" },
              {
                icon: Users,
                text: `${tournamentStats?.total_teams || 0} jamoa ro'yxatdan o'tgan`,
                color: "from-pink-400 to-red-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-full p-0.5 bg-gradient-to-r ${item.color} transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25`}
              >
                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                  <item.icon className="w-4 h-4 group-hover:animate-bounce" />
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons qo'shish */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/teams">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                <Users className="w-5 h-5 mr-2" />
                Jamoalarni ko'rish
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/bracket">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                <Swords className="w-5 h-5 mr-2" />
                Turnir jadvali
                <Trophy className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Poster Section */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="relative group mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
          <div className="relative bg-black/90 backdrop-blur-xl border-orange-500/30 rounded-3xl overflow-hidden border">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  TURNIRNING RASMIY POSTERI
                </h2>
                <p className="text-slate-400 text-lg">CS2 bo'yicha eng katta talabalar turniriga qo'shiling</p>
              </div>

              <div className="relative group/poster max-w-4xl mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-2xl blur opacity-50 group-hover/poster:opacity-75 transition duration-500" />
                <div className="relative overflow-hidden rounded-2xl border border-orange-500/30">
                  <Image
                    src="https://fr.egw.news/_next/image?url=https%3A%2F%2Fegw.news%2Fuploads%2Fnews%2F1%2F17%2F1737800715593_1737800715593.webp&w=1920&q=75"
                    alt="Counter-Strike 2 Turnir Posteri"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover/poster:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">CS2 TALABALAR CHEMPIONATI 2025</h3>
                        <p className="text-orange-200">
                          15-17 Mart • Mukofot fondi {tournamentStats?.prize_pool?.toLocaleString() || "100,000"} so'm
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-orange-400">{tournamentStats?.total_teams || 0}</div>
                        <div className="text-sm text-orange-200">JAMOA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tournament Info */}
          <div
            className={`lg:col-span-1 space-y-6 transition-all duration-1000 delay-300 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
          >
            {/* Main Info Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />
              <Card className="relative bg-black/80 backdrop-blur-xl border-orange-500/30 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-white flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    Turnir haqida ma'lumot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-slate-300">
                  {tournamentInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/item"
                    >
                      <item.icon
                        className={`w-6 h-6 ${item.color} mt-0.5 group-hover/item:scale-110 transition-transform`}
                      />
                      <div>
                        <p className="font-semibold text-white mb-1">{item.title}</p>
                        {Array.isArray(item.desc) ? (
                          item.desc.map((line, i) => (
                            <p key={i} className="text-sm text-slate-300">
                              {line}
                            </p>
                          ))
                        ) : (
                          <p className="text-sm">{item.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Requirements Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />
              <Card className="relative bg-black/80 backdrop-blur-xl border-purple-500/30 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    Talablar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-300 text-sm">
                  {[
                    "Ranch universiteti talabalari",
                    "Amal qiluvchi talaba guvohnomasi",
                    "CS2 o'yini bilan Steam akkaunti",
                  ].map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
                      <span>{req}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Stats Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />
              <Card className="relative bg-black/80 backdrop-blur-xl border-green-500/30 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500" />
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    Statistika
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Jamoalar",
                        value: tournamentStats?.total_teams?.toString() || "0",
                        color: "from-green-400 to-teal-400",
                      },
                      {
                        label: "O'yinchilar",
                        value: `${tournamentStats?.total_players || 0}`,
                        color: "from-blue-400 to-cyan-400",
                      },
                      {
                        label: "Mukofotlar",
                        value: `${Math.floor((tournamentStats?.prize_pool || 100000) / 1000)}K`,
                        color: "from-yellow-400 to-orange-400",
                      },
                      {
                        label: "Ro'yxatlar",
                        value: tournamentStats?.total_registrations?.toString() || "0",
                        color: "from-red-400 to-pink-400",
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="text-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/stat"
                      >
                        <div
                          className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Players */}
                  {tournamentStats?.recent_players && tournamentStats.recent_players.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        So'nggi ishtirokchilar
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {tournamentStats.recent_players.slice(0, 5).map((player, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              <span className="text-white text-sm font-medium">{player.name}</span>
                              {player.is_captain && <Crown className="w-3 h-3 text-yellow-400" />}
                            </div>
                            <div className="text-xs text-slate-400">
                              {player.team_name !== "Jamoasiz" ? player.team_name : "Yakkaxon"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Registration Form */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 delay-500 ${isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
              <Card className="relative bg-black/90 backdrop-blur-xl border-orange-500/30 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                      <Flame className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-3xl font-bold">Ishtirokchi ro'yxatdan o'tishi</CardTitle>
                      <CardDescription className="text-slate-400 text-lg">
                        Turnirda qatnashish uchun barcha maydonlarni to'ldiring
                      </CardDescription>
                    </div>
                  </div>

                  {/* Status Alert */}
                  {submitStatus.type && (
                    <Alert
                      className={`mb-6 ${submitStatus.type === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
                    >
                      {submitStatus.type === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <AlertDescription className={submitStatus.type === "success" ? "text-green-300" : "text-red-300"}>
                        {submitStatus.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <h3 className="text-xl font-bold text-white">Shaxsiy ma'lumotlar</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          { id: "firstName", label: "Ism", required: true },
                          { id: "lastName", label: "Familiya", required: true },
                          { id: "email", label: "Email", type: "email", required: true },
                          { id: "phone", label: "Telefon", placeholder: "+998 (90) 123-45-67", required: true },
                        ].map((field) => (
                          <div key={field.id} className="space-y-3 group">
                            <Label htmlFor={field.id} className="text-slate-300 font-medium flex items-center gap-2">
                              {field.label} {field.required && <span className="text-red-400">*</span>}
                            </Label>
                            <div className="relative">
                              <Input
                                id={field.id}
                                type={field.type || "text"}
                                value={formData[field.id as keyof typeof formData]}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className="bg-slate-800/50 border-slate-600 text-white rounded-xl h-12 px-4 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300 group-hover:border-slate-500"
                                placeholder={field.placeholder}
                                required={field.required}
                                disabled={isSubmitting}
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-focus-within:from-orange-500/10 group-focus-within:via-orange-500/5 group-focus-within:to-orange-500/10 transition-all duration-300 pointer-events-none" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

                    {/* Education Information */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <h3 className="text-xl font-bold text-white">Ta'lim haqida ma'lumot</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          {
                            id: "university",
                            label: "Ta'lim muassasasi",
                            placeholder: "Universitet/kollej nomi",
                            required: true,
                          }, 
                        ].map((field) => (
                          <div key={field.id} className="space-y-3 group">
                            <Label htmlFor={field.id} className="text-slate-300 font-medium flex items-center gap-2">
                              {field.label} {field.required && <span className="text-red-400">*</span>}
                            </Label>
                            <div className="relative">
                              <Input
                                id={field.id}
                                defaultValue={formData[field.id as keyof typeof formData]}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                className="bg-slate-800/50 border-slate-600 text-white rounded-xl h-12 px-4 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300 group-hover:border-slate-500"
                                placeholder={field.placeholder}
                                required={field.required}
                                disabled={isSubmitting}
                                readOnly
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-focus-within:from-green-500/10 group-focus-within:via-green-500/5 group-focus-within:to-green-500/10 transition-all duration-300 pointer-events-none" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

                    {/* Gaming Information */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <h3 className="text-xl font-bold text-white">O'yin haqida ma'lumot</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3 group">
                          <Label htmlFor="gameNickname" className="text-slate-300 font-medium flex items-center gap-2">
                            O'yin nomi <span className="text-red-400">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="gameNickname"
                              value={formData.gameNickname}
                              onChange={(e) => handleInputChange("gameNickname", e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white rounded-xl h-12 px-4 focus:border-red-500 focus:ring-red-500/20 transition-all duration-300 group-hover:border-slate-500"
                              required
                              disabled={isSubmitting}
                              readOnly
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-focus-within:from-red-500/10 group-focus-within:via-red-500/5 group-focus-within:to-red-500/10 transition-all duration-300 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-3 group">
                          <Label htmlFor="steamId" className="text-slate-300 font-medium flex items-center gap-2">
                            Steam ID <span className="text-red-400">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="steamId"
                              value={formData.steamId}
                              onChange={(e) => handleInputChange("steamId", e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white rounded-xl h-12 px-4 focus:border-red-500 focus:ring-red-500/20 transition-all duration-300 group-hover:border-slate-500"
                              placeholder="STEAM_0:0:123456789"
                              required
                              disabled={isSubmitting}
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-focus-within:from-red-500/10 group-focus-within:via-red-500/5 group-focus-within:to-red-500/10 transition-all duration-300 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

                    {/* Team Information */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                          4
                        </div>
                        <h3 className="text-xl font-bold text-white">Jamoa haqida ma'lumot</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-3 group">
                          <Label htmlFor="teamName" className="text-slate-300 font-medium">
                            Jamoa nomi
                          </Label>
                          <div className="relative">
                            <Input
                              id="teamName"
                              value={formData.teamName}
                              onChange={(e) => handleInputChange("teamName", e.target.value)}
                              className="bg-slate-800/50 border-slate-600 text-white rounded-xl h-12 px-4 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 group-hover:border-slate-500"
                              placeholder="Agar jamoangiz bo'lsa"
                              disabled={isSubmitting}
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-focus-within:from-purple-500/10 group-focus-within:via-purple-500/5 group-focus-within:to-purple-500/10 transition-all duration-300 pointer-events-none" />
                          </div>
                        </div>

                        {/* Jamoa a'zolari bo'limi */}
                        {showTeamMembers && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <UserPlus className="w-5 h-5 text-purple-400" />
                                <h4 className="text-lg font-semibold text-white">Jamoa a'zolari</h4>
                                <span className="text-sm text-slate-400">({teamMembers.length}/6 a'zo)</span>
                              </div>
                              <Button
                                type="button"
                                onClick={addTeamMember}
                                disabled={teamMembers.length >= 6 || isSubmitting}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg"
                                size="sm"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                A'zo qo'shish
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {teamMembers.map((member, index) => (
                                <div
                                  key={member.id}
                                  className="relative group/member p-4 rounded-xl bg-slate-800/30 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-white font-medium flex items-center gap-2">
                                      <Users className="w-4 h-4 text-purple-400" />
                                      A'zo #{index + 1}
                                    </h5>
                                    <Button
                                      type="button"
                                      onClick={() => removeTeamMember(member.id)}
                                      disabled={isSubmitting}
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                      <Label className="text-slate-300 text-sm">Ism</Label>
                                      <Input
                                        value={member.firstName}
                                        onChange={(e) => updateTeamMember(member.id, "firstName", e.target.value)}
                                        className="bg-slate-700/50 border-slate-600 text-white rounded-lg h-10 text-sm focus:border-purple-500 focus:ring-purple-500/20"
                                        placeholder="Ism"
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <Label className="text-slate-300 text-sm">Familiya</Label>
                                      <Input
                                        value={member.lastName}
                                        onChange={(e) => updateTeamMember(member.id, "lastName", e.target.value)}
                                        className="bg-slate-700/50 border-slate-600 text-white rounded-lg h-10 text-sm focus:border-purple-500 focus:ring-purple-500/20"
                                        placeholder="Familiya"
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <Label className="text-slate-300 text-sm">O'yin nomi</Label>
                                      <Input
                                        value={member.gameNickname}
                                        onChange={(e) => updateTeamMember(member.id, "gameNickname", e.target.value)}
                                        className="bg-slate-700/50 border-slate-600 text-white rounded-lg h-10 text-sm focus:border-purple-500 focus:ring-purple-500/20"
                                        placeholder="CS2 nickname"
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <Label className="text-slate-300 text-sm">Email</Label>
                                      <Input
                                        type="email"
                                        value={member.email}
                                        onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                                        className="bg-slate-700/50 border-slate-600 text-white rounded-lg h-10 text-sm focus:border-purple-500 focus:ring-purple-500/20"
                                        placeholder="email@example.com"
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                    <div className="space-y-3 md:col-span-2">
                                      <Label className="text-slate-300 text-sm">Telefon</Label>
                                      <Input
                                        value={member.phone}
                                        onChange={(e) => updateTeamMember(member.id, "phone", e.target.value)}
                                        className="bg-slate-700/50 border-slate-600 text-white rounded-lg h-10 text-sm focus:border-purple-500 focus:ring-purple-500/20"
                                        placeholder="+998 (90) 123-45-67"
                                        disabled={isSubmitting}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {teamMembers.length === 0 && (
                                <div className="text-center py-8 text-slate-400">
                                  <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                  <p>Jamoa a'zolarini qo'shish uchun yuqoridagi tugmani bosing</p>
                                  <p className="text-sm mt-1">Maksimal 6 ta a'zo qo'shishingiz mumkin</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

                    {/* Additional Information */}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                          5
                        </div>
                        <h3 className="text-xl font-bold text-white">Qo'shimcha ma'lumot</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 to-transparent" />
                      </div>
                      <div className="space-y-3 group">
                        <Label htmlFor="additionalInfo" className="text-slate-300 font-medium">
                          Izohlar
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white rounded-xl px-4 py-3 focus:border-yellow-500 focus:ring-yellow-500/20 transition-all duration-300 group-hover:border-slate-500 min-h-[100px]"
                            placeholder="Aytmoqchi bo'lgan qo'shimcha ma'lumotlaringiz"
                            disabled={isSubmitting}
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-focus-within:from-yellow-500/10 group-focus-within:via-yellow-500/5 group-focus-within:to-yellow-500/10 transition-all duration-300 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="relative w-full bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 hover:from-orange-700 hover:via-red-700 hover:to-yellow-700 text-white font-bold py-4 text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                              YUBORILMOQDA...
                              <Loader2 className="w-6 h-6 ml-3 animate-spin" />
                            </>
                          ) : (
                            <>
                              <Flame className="w-6 h-6 mr-3 animate-pulse" />
                              TURNIRGA RO'YXATDAN O'TISH
                              <Zap className="w-6 h-6 ml-3 animate-pulse" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black/90 backdrop-blur-xl border-t border-orange-500/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 text-2xl font-bold text-white">
              <Crosshair className="w-8 h-8 text-orange-500" />
              CS2 CHEMPIONATI
            </div>
          </div>
          <p className="text-slate-400 mb-4">© 2025 CS2 Talabalar Chempionati. Barcha huquqlar himoyalangan.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <a href="mailto:ranchuniversity@gmail.com" className="hover:text-orange-400 transition-colors">
              ranchuniversity@gmail.com
            </a>
            <span>|</span>
            <a href="tel:+998991899991" className="hover:text-orange-400 transition-colors">
              +998 (99) 189-99-91
            </a>
            <span>|</span>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <a
                  href="#"
                  className="hover:text-orange-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsModalOpen(true)
                  }}
                >
                  Turnir qoidalari
                </a>
              </DialogTrigger>
              <DialogContent className="bg-black/90 backdrop-blur-xl border-orange-500/30 rounded-2xl text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Turnir Qoidalari
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4 text-slate-300">
                  <ul className="list-disc pl-6 space-y-2">
                    {tournamentRules.map((rule, index) => (
                      <li key={index} className="text-sm">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </footer>

      {/* Success modal qo'shish (return statement oxirida) */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        registrationData={registrationResponse}
      />

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
