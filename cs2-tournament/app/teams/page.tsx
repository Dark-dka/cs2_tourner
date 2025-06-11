"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, Crown, Search, Filter, Mail, User, Gamepad2, ArrowLeft, Shield, Star, Target, Zap } from "lucide-react"
import Link from "next/link"

// API configuration
const API_BASE_URL = "https://turnir.utu-ranch.uz/api"

interface TeamMember {
  name: string
  game_nickname: string
  is_captain: boolean
}

interface Team {
  id: number
  name: string
  captain_name: string
  captain_email: string
  captain_phone: string
  university: string
  members_count: number
  members: TeamMember[]
  created_at: string
  is_approved: boolean
}

interface TournamentStats {
  tournament_name: string
  total_teams: number
  total_players: number
  teams: Team[]
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<TournamentStats | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    filterTeams()
  }, [teams, searchTerm, filterStatus])

  const fetchTeams = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/tournaments/active/stats/`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setTeams(data.teams || [])
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTeams = () => {
    let filtered = teams

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.captain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.university.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((team) => (filterStatus === "approved" ? team.is_approved : !team.is_approved))
    }

    setFilteredTeams(filtered)
  }

  const getTeamInitials = (teamName: string) => {
    return teamName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getPlayerInitials = (playerName: string) => {
    return playerName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Jamoalar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-red-900/20 to-yellow-900/20" />
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
          {[...Array(15)].map((_, i) => (
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

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button
                variant="outline"
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Orqaga
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Ro'yxatdan o'tgan jamoalar
                </h1>
                <p className="text-slate-400 text-lg">
                  {stats?.tournament_name || "CS2 Talabalar Chempionati"} ishtirokchilari
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Jami jamoalar",
                value: stats?.total_teams || 0,
                icon: Users,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Jami o'yinchilar",
                value: stats?.total_players || 0,
                icon: User,
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Tasdiqlangan",
                value: teams.filter((team) => team.is_approved).length,
                icon: Shield,
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Kutilayotgan",
                value: teams.filter((team) => !team.is_approved).length,
                icon: Target,
                color: "from-orange-500 to-red-500",
              },
            ].map((stat, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <Card className="relative bg-black/80 backdrop-blur-xl border-orange-500/30 rounded-2xl overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                        <p
                          className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                        >
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Jamoa nomi, sardor yoki universitet bo'yicha qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white rounded-xl h-12 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: "all", label: "Barchasi", count: teams.length },
                { key: "approved", label: "Tasdiqlangan", count: teams.filter((t) => t.is_approved).length },
                { key: "pending", label: "Kutilayotgan", count: teams.filter((t) => !t.is_approved).length },
              ].map((filter) => (
                <Button
                  key={filter.key}
                  variant={filterStatus === filter.key ? "default" : "outline"}
                  onClick={() => setFilterStatus(filter.key as any)}
                  className={`${
                    filterStatus === filter.key
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                  } rounded-xl`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filter.label} ({filter.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative group inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-lg opacity-50 animate-pulse" />
              <div className="relative p-8 bg-black/50 rounded-full backdrop-blur-sm border border-orange-500/50">
                <Users className="w-16 h-16 text-orange-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mt-6 mb-2">Jamoalar topilmadi</h3>
            <p className="text-slate-400">Qidiruv shartlaringizni o'zgartiring yoki keyinroq qaytib keling</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => (
              <div
                key={team.id}
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <Card className="relative bg-black/80 backdrop-blur-xl border-orange-500/30 rounded-2xl overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500">
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
                            {getTeamInitials(team.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-white text-lg">{team.name}</CardTitle>
                          <CardDescription className="text-slate-400">{team.members_count} a'zo</CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          team.is_approved
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {team.is_approved ? "Tasdiqlangan" : "Kutilmoqda"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Captain Info */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-semibold text-sm">Sardor</p>
                        <p className="text-slate-400 text-sm">{team.captain_name}</p>
                      </div>
                    </div>

                    {/* University */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Gamepad2 className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-semibold text-sm">Universitet</p>
                        <p className="text-slate-400 text-sm">{team.university}</p>
                      </div>
                    </div>

                    {/* Members Preview */}
                    <div className="space-y-2">
                      <p className="text-white font-semibold text-sm flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        Jamoa a'zolari ({team.members_count})
                      </p>
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 4).map((member, idx) => (
                          <Avatar
                            key={idx}
                            className="w-8 h-8 border-2 border-black bg-gradient-to-r from-blue-500 to-purple-500"
                          >
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                              {getPlayerInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members_count > 4 && (
                          <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-black flex items-center justify-center">
                            <span className="text-white text-xs font-bold">+{team.members_count - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedTeam(team)}
                          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl transition-all duration-300"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Batafsil ko'rish
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/95 backdrop-blur-xl border-orange-500/30 rounded-3xl text-white max-w-2xl">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />

                        <DialogHeader className="pb-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500">
                              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xl">
                                {selectedTeam && getTeamInitials(selectedTeam.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                {selectedTeam?.name}
                              </DialogTitle>
                              <p className="text-slate-400 text-lg">{selectedTeam?.university}</p>
                            </div>
                          </div>
                        </DialogHeader>

                        {selectedTeam && (
                          <div className="space-y-6">
                            {/* Captain Details */}
                            <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-25" />
                              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                  <Crown className="w-6 h-6 text-yellow-400" />
                                  Jamoa sardori
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <div>
                                      <p className="text-slate-300 text-sm">Ism</p>
                                      <p className="text-white font-semibold">{selectedTeam.captain_name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-green-400" />
                                    <div>
                                      <p className="text-slate-300 text-sm">Email</p>
                                      <p className="text-white font-semibold">{selectedTeam.captain_email}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Team Members */}
                            <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25" />
                              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                  <Users className="w-6 h-6 text-blue-400" />
                                  Jamoa a'zolari ({selectedTeam.members_count})
                                </h3>
                                <div className="grid gap-3">
                                  {selectedTeam.members.map((member, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                      <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500">
                                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                                          {getPlayerInitials(member.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="text-white font-semibold">{member.name}</p>
                                          {member.is_captain && (
                                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                              <Crown className="w-3 h-3 mr-1" />
                                              Sardor
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-slate-400 text-sm">@{member.game_nickname}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Team Stats */}
                            <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25" />
                              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                  <Star className="w-6 h-6 text-green-400" />
                                  Jamoa statistikasi
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-green-400">{selectedTeam.members_count}</p>
                                    <p className="text-slate-400 text-sm">A'zolar</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-400">
                                      {new Date(selectedTeam.created_at).toLocaleDateString("uz-UZ")}
                                    </p>
                                    <p className="text-slate-400 text-sm">Ro'yxat sanasi</p>
                                  </div>
                                  <div className="text-center">
                                    <p
                                      className={`text-2xl font-bold ${
                                        selectedTeam.is_approved ? "text-green-400" : "text-yellow-400"
                                      }`}
                                    >
                                      {selectedTeam.is_approved ? "✓" : "⏳"}
                                    </p>
                                    <p className="text-slate-400 text-sm">Holat</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

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
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
