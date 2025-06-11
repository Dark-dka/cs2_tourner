"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trophy, Users, Calendar, Crown, Mail, User } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  registrationData: {
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
    registration_id: number
  } | null
}

export default function SuccessModal({ isOpen, onClose, registrationData }: SuccessModalProps) {
  if (!registrationData) return null

  const { player_info, tournament_info, registration_id } = registrationData

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 backdrop-blur-xl border-green-500/30 rounded-3xl text-white max-w-2xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

        <DialogHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-lg opacity-75 animate-pulse" />
              <div className="relative p-6 bg-black/50 rounded-full backdrop-blur-sm border border-green-500/50">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
            </div>
          </div>

          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Muvaffaqiyatli ro'yxatdan o'tdingiz! 🎉
          </DialogTitle>

          <p className="text-slate-300 text-lg">
            Sizning ma'lumotlaringiz qabul qilindi va tez orada siz bilan bog'lanamiz.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Registration Info */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <User className="w-6 h-6 text-green-400" />
                Sizning ma'lumotlaringiz
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-slate-300">Ism:</span>
                    <span className="text-white font-semibold">{player_info.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-slate-300">Email:</span>
                    <span className="text-white font-semibold">{player_info.email}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    <span className="text-slate-300">O'yin nomi:</span>
                    <span className="text-white font-semibold">{player_info.game_nickname}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-slate-300">Ro'yxat ID:</span>
                    <span className="text-white font-semibold">#{registration_id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Info */}
          {player_info.team_name && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-400" />
                  Jamoa ma'lumotlari
                </h3>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-slate-300">Jamoa nomi:</span>
                    <span className="text-white font-semibold">{player_info.team_name}</span>
                  </div>

                  {player_info.is_captain && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      <Crown className="w-4 h-4 mr-1" />
                      Sardor
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tournament Info */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-orange-400" />
                Turnir ma'lumotlari
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  <span className="text-slate-300">Turnir nomi:</span>
                  <span className="text-white font-semibold">{tournament_info.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-slate-300">Boshlanish sanasi:</span>
                  <span className="text-white font-semibold">
                    {new Date(tournament_info.start_date).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-teal-400" />
                Keyingi qadamlar
              </h3>

              <div className="space-y-3 text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-white font-semibold">Email orqali tasdiqlash</p>
                    <p className="text-sm">Sizga email yuboriladi, unda qo'shimcha ko'rsatmalar bo'ladi</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-white font-semibold">Tayyorgarlik</p>
                    <p className="text-sm">CS2 o'yinini yangilab oling va internetingizni tekshiring</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-white font-semibold">Turnir kuni</p>
                    <p className="text-sm">15-17 Mart kunlari turnirda qatnashing va g'alaba qozoning!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Yaxshi, tushundim!
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open("mailto:ranchuniversity@gmail.com", "_blank")}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white py-3 rounded-xl transition-all duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Bog'lanish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
