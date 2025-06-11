"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    ArrowLeft,
    Trophy,
    Calendar,
    Swords,
    Medal,
    Clock,
    Flame,
    Crown,
    Star,
    Gamepad2,
    Info,
    Zap,
    CheckIcon,
    AlertCircle,
    Loader2,
} from "lucide-react"

// API configuration
const API_BASE_URL = "https://turnir.utu-ranch.uz/api"

// Backend bilan mos interfacelar
interface Team {
    id: number
    name: string
    members_count: number
    is_approved: boolean
}

interface Match {
    id: number
    round: number
    match_number: number
    team1: Team | null
    team2: Team | null
    team1_score?: number
    team2_score?: number
    winner_id?: number
    status: "scheduled" | "live" | "completed" | "upcoming"
    match_time?: string
    match_date?: string
}

interface Round {
    id: number
    name: string
    matches: Match[]
}

interface BracketData {
    tournament_name: string
    start_date: string
    end_date: string
    current_round: number
    rounds: Round[]
}

export default function BracketPage() {
    const [bracketData, setBracketData] = useState<BracketData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
    const [activeTab, setActiveTab] = useState("bracket")

    useEffect(() => {
        fetchBracketData()
    }, [])

    const fetchBracketData = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`${API_BASE_URL}/bracket/`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setBracketData(data)
        } catch (error) {
            console.error("Error fetching bracket data:", error)
            setError(error instanceof Error ? error.message : "Ma'lumotlarni yuklashda xatolik yuz berdi")
        } finally {
            setIsLoading(false)
        }
    }

    const getTeamInitials = (teamName: string) => {
        return teamName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const getMatchStatusBadge = (status: string) => {
        switch (status) {
            case "live":
                return (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                        <Flame className="w-3 h-3 mr-1" />
                        Jonli
                    </Badge>
                )
            case "completed":
                return (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckIcon className="w-3 h-3 mr-1" />
                        Yakunlangan
                    </Badge>
                )
            case "upcoming":
                return (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Kutilmoqda
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        Rejalashtirilgan
                    </Badge>
                )
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-orange-400 animate-pulse" />
                    </div>
                    <p className="text-white text-xl">Turnir ma'lumotlari yuklanmoqda...</p>
                    <p className="text-slate-400 mt-2">Backend serverga ulanilmoqda</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="relative mb-6">
                        <div className="p-6 bg-red-500/10 rounded-full border border-red-500/30 inline-block">
                            <AlertCircle className="w-16 h-16 text-red-400" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Xatolik yuz berdi</h2>
                    <Alert className="border-red-500/30 bg-red-500/10 mb-6">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300">{error}</AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                        <Button
                            onClick={fetchBracketData}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                        >
                            <Loader2 className="w-4 h-4 mr-2" />
                            Qaytadan urinish
                        </Button>
                        <Link href="/">
                            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Bosh sahifaga qaytish
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // No data state
    if (!bracketData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="p-6 bg-slate-500/10 rounded-full border border-slate-500/30 inline-block mb-6">
                        <Trophy className="w-16 h-16 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Turnir jadvali topilmadi</h2>
                    <p className="text-slate-400 mb-6">Hozircha faol turnir mavjud emas</p>
                    <Link href="/">
                        <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Bosh sahifaga qaytish
                        </Button>
                    </Link>
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
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                    Turnir jadvali
                                </h1>
                                <p className="text-slate-400 text-lg">{bracketData.tournament_name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tournament Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[
                            {
                                title: "Boshlangan",
                                value: formatDate(bracketData.start_date),
                                icon: Calendar,
                                color: "from-blue-500 to-cyan-500",
                            },
                            {
                                title: "Tugaydi",
                                value: formatDate(bracketData.end_date),
                                icon: Clock,
                                color: "from-green-500 to-emerald-500",
                            },
                            {
                                title: "Joriy bosqich",
                                value: bracketData.rounds[bracketData.current_round - 1]?.name || "Yakunlangan",
                                icon: Star,
                                color: "from-purple-500 to-pink-500",
                            },
                            {
                                title: "G'olib",
                                value: (() => {
                                    const finalRound = bracketData.rounds.find((r) => r.name === "Финал")
                                    const finalMatch = finalRound?.matches[0]
                                    if (finalMatch?.winner_id) {
                                        return finalMatch.winner_id === finalMatch.team1?.id
                                            ? finalMatch.team1?.name
                                            : finalMatch.team2?.name
                                    }
                                    return "Aniqlanmagan"
                                })(),
                                icon: Crown,
                                color: "from-yellow-500 to-orange-500",
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
                                                <p className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
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
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="bg-black/50 border border-orange-500/30 p-1 rounded-xl">
                        <TabsTrigger
                            value="bracket"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg"
                        >
                            <Trophy className="w-4 h-4 mr-2" />
                            Turnir jadvali
                        </TabsTrigger>
                        <TabsTrigger
                            value="matches"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg"
                        >
                            <Swords className="w-4 h-4 mr-2" />
                            O'yinlar
                        </TabsTrigger>
                        <TabsTrigger
                            value="winners"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg"
                        >
                            <Medal className="w-4 h-4 mr-2" />
                            G'oliblar
                        </TabsTrigger>
                    </TabsList>

                    {/* Bracket Tab */}
                    <TabsContent value="bracket" className="mt-6">
                        <div className="relative group mb-8">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
                            <Card className="relative bg-black/90 backdrop-blur-xl border-orange-500/30 rounded-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        Turnir jadvali
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="overflow-x-auto">
                                    <div className="min-w-[1000px] p-4">
                                        <div className="flex justify-between">
                                            {bracketData.rounds.map((round, roundIndex) => (
                                                <div
                                                    key={round.id}
                                                    className="flex flex-col space-y-4 flex-1"
                                                    style={{
                                                        paddingTop: roundIndex === 0 ? "0" : `${Math.pow(2, roundIndex) * 30}px`,
                                                        paddingBottom: roundIndex === 0 ? "0" : `${Math.pow(2, roundIndex) * 30}px`,
                                                    }}
                                                >
                                                    <div className="text-center mb-4">
                                                        <div
                                                            className={`inline-block px-4 py-2 rounded-lg ${roundIndex === bracketData.current_round - 1
                                                                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                                                    : "bg-slate-800/50 text-slate-300"
                                                                }`}
                                                        >
                                                            <p className="font-semibold">{round.name}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-8 md:space-y-16 lg:space-y-24">
                                                        {round.matches.map((match) => (
                                                            <Dialog key={match.id}>
                                                                <DialogTrigger asChild>
                                                                    <div
                                                                        className="relative group cursor-pointer"
                                                                        onClick={() => setSelectedMatch(match)}
                                                                    >
                                                                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300" />
                                                                        <div className="relative bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-xl overflow-hidden">
                                                                            <div
                                                                                className={`absolute top-0 left-0 w-full h-1 ${match.status === "live"
                                                                                        ? "bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"
                                                                                        : match.status === "completed"
                                                                                            ? "bg-gradient-to-r from-green-500 to-teal-500"
                                                                                            : "bg-gradient-to-r from-blue-500 to-purple-500"
                                                                                    }`}
                                                                            />

                                                                            <div className="p-3">
                                                                                {/* Match Header */}
                                                                                <div className="flex justify-between items-center mb-2 text-xs text-slate-400">
                                                                                    <div>O'yin #{match.id}</div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        {match.match_date && (
                                                                                            <>
                                                                                                <Calendar className="w-3 h-3" />
                                                                                                {formatDate(match.match_date)}
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                {/* Team 1 */}
                                                                                <div
                                                                                    className={`flex items-center justify-between p-2 rounded-lg ${match.winner_id === match.team1?.id
                                                                                            ? "bg-green-500/10 border border-green-500/30"
                                                                                            : "bg-slate-800/50"
                                                                                        } mb-2`}
                                                                                >
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500">
                                                                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xs">
                                                                                                {match.team1 ? getTeamInitials(match.team1.name) : "TBD"}
                                                                                            </AvatarFallback>
                                                                                        </Avatar>
                                                                                        <span className="text-white font-medium truncate max-w-[100px]">
                                                                                            {match.team1?.name || "TBD"}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="text-white font-bold">
                                                                                        {match.team1_score !== undefined ? match.team1_score : "-"}
                                                                                    </div>
                                                                                </div>

                                                                                {/* Team 2 */}
                                                                                <div
                                                                                    className={`flex items-center justify-between p-2 rounded-lg ${match.winner_id === match.team2?.id
                                                                                            ? "bg-green-500/10 border border-green-500/30"
                                                                                            : "bg-slate-800/50"
                                                                                        }`}
                                                                                >
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Avatar className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500">
                                                                                            <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xs">
                                                                                                {match.team2 ? getTeamInitials(match.team2.name) : "TBD"}
                                                                                            </AvatarFallback>
                                                                                        </Avatar>
                                                                                        <span className="text-white font-medium truncate max-w-[100px]">
                                                                                            {match.team2?.name || "TBD"}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="text-white font-bold">
                                                                                        {match.team2_score !== undefined ? match.team2_score : "-"}
                                                                                    </div>
                                                                                </div>

                                                                                {/* Match Status */}
                                                                                <div className="mt-2 flex justify-center">
                                                                                    {getMatchStatusBadge(match.status)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </DialogTrigger>

                                                                {/* Match Details Modal */}
                                                                <DialogContent className="bg-black/95 backdrop-blur-xl border-orange-500/30 rounded-3xl text-white max-w-2xl">
                                                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />

                                                                    <DialogHeader className="pb-6">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                                                                                <Swords className="w-8 h-8 text-white" />
                                                                            </div>
                                                                            <div>
                                                                                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                                                                    O'yin #{match.id} tafsilotlari
                                                                                </DialogTitle>
                                                                                <p className="text-slate-400 text-lg">
                                                                                    {match.match_date && match.match_time
                                                                                        ? `${formatDate(match.match_date)} - ${formatTime(match.match_time)}`
                                                                                        : "Sana belgilanmagan"}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </DialogHeader>

                                                                    <div className="space-y-6">
                                                                        {/* Match Status */}
                                                                        <div className="flex justify-center">
                                                                            <div
                                                                                className={`px-4 py-2 rounded-full ${match.status === "live"
                                                                                        ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                                                                                        : match.status === "completed"
                                                                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                                                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    {match.status === "live" ? (
                                                                                        <Flame className="w-5 h-5" />
                                                                                    ) : match.status === "completed" ? (
                                                                                        <CheckIcon className="w-5 h-5" />
                                                                                    ) : (
                                                                                        <Clock className="w-5 h-5" />
                                                                                    )}
                                                                                    <span className="font-semibold">
                                                                                        {match.status === "live"
                                                                                            ? "Jonli efir"
                                                                                            : match.status === "completed"
                                                                                                ? "Yakunlangan"
                                                                                                : "Kutilmoqda"}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Teams */}
                                                                        <div className="grid grid-cols-5 gap-4 items-center">
                                                                            {/* Team 1 */}
                                                                            <div className="col-span-2 text-center">
                                                                                <Avatar className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500">
                                                                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-2xl">
                                                                                        {match.team1 ? getTeamInitials(match.team1.name) : "TBD"}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                <h3 className="text-xl font-bold text-white mt-3">
                                                                                    {match.team1?.name || "TBD"}
                                                                                </h3>
                                                                                <p className="text-slate-400">
                                                                                    {match.team1 ? `${match.team1.members_count} a'zo` : ""}
                                                                                </p>
                                                                                {match.winner_id === match.team1?.id && (
                                                                                    <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                                                                                        <Crown className="w-3 h-3 mr-1" />
                                                                                        G'olib
                                                                                    </Badge>
                                                                                )}
                                                                            </div>

                                                                            {/* Score */}
                                                                            <div className="col-span-1 text-center">
                                                                                <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                                                                    {match.team1_score !== undefined ? match.team1_score : "-"}
                                                                                    <span className="mx-2 text-slate-500">:</span>
                                                                                    {match.team2_score !== undefined ? match.team2_score : "-"}
                                                                                </div>
                                                                                <p className="text-slate-400 mt-2">Hisob</p>
                                                                            </div>

                                                                            {/* Team 2 */}
                                                                            <div className="col-span-2 text-center">
                                                                                <Avatar className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-orange-500">
                                                                                    <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-2xl">
                                                                                        {match.team2 ? getTeamInitials(match.team2.name) : "TBD"}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                <h3 className="text-xl font-bold text-white mt-3">
                                                                                    {match.team2?.name || "TBD"}
                                                                                </h3>
                                                                                <p className="text-slate-400">
                                                                                    {match.team2 ? `${match.team2.members_count} a'zo` : ""}
                                                                                </p>
                                                                                {match.winner_id === match.team2?.id && (
                                                                                    <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                                                                                        <Crown className="w-3 h-3 mr-1" />
                                                                                        G'olib
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Match Details */}
                                                                        <div className="relative group">
                                                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25" />
                                                                            <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                                                                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                                                                    <Info className="w-6 h-6 text-blue-400" />
                                                                                    O'yin ma'lumotlari
                                                                                </h3>
                                                                                <div className="grid md:grid-cols-2 gap-4">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <Calendar className="w-5 h-5 text-blue-400" />
                                                                                        <div>
                                                                                            <p className="text-slate-300 text-sm">Sana</p>
                                                                                            <p className="text-white font-semibold">
                                                                                                {match.match_date ? formatDate(match.match_date) : "Belgilanmagan"}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <Clock className="w-5 h-5 text-green-400" />
                                                                                        <div>
                                                                                            <p className="text-slate-300 text-sm">Vaqt</p>
                                                                                            <p className="text-white font-semibold">
                                                                                                {match.match_time ? formatTime(match.match_time) : "Belgilanmagan"}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <Trophy className="w-5 h-5 text-yellow-400" />
                                                                                        <div>
                                                                                            <p className="text-slate-300 text-sm">Bosqich</p>
                                                                                            <p className="text-white font-semibold">
                                                                                                {bracketData.rounds.find((r) => r.id === match.round)?.name ||
                                                                                                    round.name}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-3">
                                                                                        <Gamepad2 className="w-5 h-5 text-purple-400" />
                                                                                        <div>
                                                                                            <p className="text-slate-300 text-sm">O'yin turi</p>
                                                                                            <p className="text-white font-semibold">Counter-Strike 2</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Match Result */}
                                                                        {match.status === "completed" && match.winner_id && (
                                                                            <div className="relative group">
                                                                                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25" />
                                                                                <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                                                                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                                                                        <Medal className="w-6 h-6 text-green-400" />
                                                                                        O'yin natijasi
                                                                                    </h3>
                                                                                    <div className="text-center">
                                                                                        <p className="text-slate-300 mb-2">G'olib jamoa</p>
                                                                                        <div className="flex items-center justify-center gap-3">
                                                                                            <Crown className="w-6 h-6 text-yellow-400" />
                                                                                            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                                                                                {match.winner_id === match.team1?.id
                                                                                                    ? match.team1?.name
                                                                                                    : match.winner_id === match.team2?.id
                                                                                                        ? match.team2?.name
                                                                                                        : "Aniqlanmagan"}
                                                                                            </p>
                                                                                        </div>
                                                                                        <p className="text-slate-400 mt-2">
                                                                                            Hisob: {match.team1_score} - {match.team2_score}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Matches Tab */}
                    <TabsContent value="matches" className="mt-6">
                        <div className="relative group mb-8">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
                            <Card className="relative bg-black/90 backdrop-blur-xl border-orange-500/30 rounded-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                            <Swords className="w-6 h-6 text-white" />
                                        </div>
                                        Barcha o'yinlar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {bracketData.rounds.map((round) => (
                                            <div key={round.id} className="space-y-4">
                                                <h3 className="text-xl font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                                    {round.name}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {round.matches.map((match) => (
                                                        <div key={match.id} className="relative group">
                                                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300" />
                                                            <Card className="relative bg-black/80 backdrop-blur-sm border-orange-500/30 rounded-xl overflow-hidden">
                                                                <div
                                                                    className={`absolute top-0 left-0 w-full h-1 ${match.status === "live"
                                                                            ? "bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"
                                                                            : match.status === "completed"
                                                                                ? "bg-gradient-to-r from-green-500 to-teal-500"
                                                                                : "bg-gradient-to-r from-blue-500 to-purple-500"
                                                                        }`}
                                                                />

                                                                <CardContent className="p-4">
                                                                    {/* Match Header */}
                                                                    <div className="flex justify-between items-center mb-3 text-xs text-slate-400">
                                                                        <div>O'yin #{match.id}</div>
                                                                        <div className="flex items-center gap-1">
                                                                            {match.match_date && (
                                                                                <>
                                                                                    <Calendar className="w-3 h-3" />
                                                                                    {formatDate(match.match_date)}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Teams */}
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        {/* Team 1 */}
                                                                        <div className="text-center">
                                                                            <Avatar className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500">
                                                                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                                                                                    {match.team1 ? getTeamInitials(match.team1.name) : "TBD"}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <p className="text-white font-medium mt-1 text-sm truncate max-w-[80px]">
                                                                                {match.team1?.name || "TBD"}
                                                                            </p>
                                                                        </div>

                                                                        {/* Score */}
                                                                        <div className="text-center">
                                                                            <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                                                                {match.team1_score !== undefined ? match.team1_score : "-"}
                                                                                <span className="mx-2 text-slate-500">:</span>
                                                                                {match.team2_score !== undefined ? match.team2_score : "-"}
                                                                            </div>
                                                                            <div className="mt-1">{getMatchStatusBadge(match.status)}</div>
                                                                        </div>

                                                                        {/* Team 2 */}
                                                                        <div className="text-center">
                                                                            <Avatar className="w-12 h-12 mx-auto bg-gradient-to-r from-red-500 to-orange-500">
                                                                                <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold">
                                                                                    {match.team2 ? getTeamInitials(match.team2.name) : "TBD"}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <p className="text-white font-medium mt-1 text-sm truncate max-w-[80px]">
                                                                                {match.team2?.name || "TBD"}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Winner */}
                                                                    {match.winner_id && (
                                                                        <div className="text-center">
                                                                            <div className="flex items-center justify-center gap-1 text-sm">
                                                                                <Crown className="w-4 h-4 text-yellow-400" />
                                                                                <span className="text-white">G'olib:</span>
                                                                                <span className="font-semibold text-yellow-400">
                                                                                    {match.winner_id === match.team1?.id
                                                                                        ? match.team1?.name
                                                                                        : match.winner_id === match.team2?.id
                                                                                            ? match.team2?.name
                                                                                            : "Aniqlanmagan"}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Details Button */}
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                onClick={() => setSelectedMatch(match)}
                                                                                className="w-full mt-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-300"
                                                                                size="sm"
                                                                            >
                                                                                <Zap className="w-4 h-4 mr-2" />
                                                                                Batafsil
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        {/* Same modal content as in bracket tab */}
                                                                    </Dialog>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Winners Tab */}
                    <TabsContent value="winners" className="mt-6">
                        <div className="relative group mb-8">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
                            <Card className="relative bg-black/90 backdrop-blur-xl border-orange-500/30 rounded-3xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500" />
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                            <Medal className="w-6 h-6 text-white" />
                                        </div>
                                        Turnir g'oliblari
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-12">
                                        {/* Champion */}
                                        {(() => {
                                            const finalRound = bracketData.rounds.find((r) => r.name === "Финал")
                                            const finalMatch = finalRound?.matches[0]
                                            const champion =
                                                finalMatch?.winner_id === finalMatch?.team1?.id
                                                    ? finalMatch?.team1
                                                    : finalMatch?.winner_id === finalMatch?.team2?.id
                                                        ? finalMatch?.team2
                                                        : null

                                            return champion ? (
                                                <div className="text-center">
                                                    <div className="relative inline-block">
                                                        <div className="absolute -inset-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-75 animate-pulse" />
                                                        <Avatar className="w-32 h-32 mx-auto border-4 border-orange-500 relative">
                                                            <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-4xl">
                                                                {getTeamInitials(champion.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-black/20 backdrop-blur-sm z-10" />
                                                        <Crown className="absolute top-2 left-2 w-8 h-8 text-yellow-400 z-20" />
                                                    </div>
                                                    <h3 className="text-3xl font-bold text-white mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                                        {champion.name}
                                                    </h3>
                                                    <p className="text-slate-400 text-lg">Turnir g'olibi</p>
                                                    <Badge className="mt-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                                        <Trophy className="w-4 h-4 mr-1" />
                                                        Chempion
                                                    </Badge>
                                                </div>
                                            ) : null
                                        })()}

                                        {/* All Winners by Round */}
                                        <div className="space-y-6">
                                            {bracketData.rounds
                                                .slice(0, -1)
                                                .reverse()
                                                .map((round) => (
                                                    <div key={round.id} className="relative group">
                                                        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl blur opacity-25" />
                                                        <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                                                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                                                <Medal className="w-6 h-6 text-green-400" />
                                                                {round.name} g'oliblari
                                                            </h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                {round.matches.map((match) => {
                                                                    const winner =
                                                                        match.winner_id === match.team1?.id
                                                                            ? match.team1
                                                                            : match.winner_id === match.team2?.id
                                                                                ? match.team2
                                                                                : null

                                                                    return winner ? (
                                                                        <div key={match.id} className="text-center">
                                                                            <Avatar className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-teal-500">
                                                                                <AvatarFallback className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-2xl">
                                                                                    {getTeamInitials(winner.name)}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                            <h4 className="text-lg font-bold text-white mt-3">{winner.name}</h4>
                                                                            <p className="text-slate-400">{winner.members_count} a'zo</p>
                                                                        </div>
                                                                    ) : null
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
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
      `}</style>
        </div>
    )
}
