"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserLock, UserRoundPlus, UserRoundX } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  image: string | null;
  startDate: string;
  maxParticipants: number;
  registrationDeadline: string | null;
  registrationStartDate?: string | null;
  registrationOpen: boolean;
  _count: {
    registrations: number;
  };
}

export default function Pendaftaran() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [status, setStatus] = useState("waiting"); // 'waiting', 'open', 'closed'
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch activity data
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch("/api/activities/current");
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setActivity(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const closeDate = useMemo(() => {
    if (!activity?.registrationDeadline) return new Date();
    return new Date(activity.registrationDeadline);
  }, [activity]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!activity) return;

      const now = new Date().getTime();
      const closeTime = closeDate.getTime();
      const startTime = new Date(activity.startDate).getTime();

      // Tentukan waktu pembukaan pendaftaran untuk debug
      let debugOpenTime: number;
      if (activity.registrationStartDate) {
        debugOpenTime = new Date(activity.registrationStartDate).getTime();
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        debugOpenTime = tomorrow.getTime();
      }

      // Debug logging
      console.log("Auto-Open Registration Debug:", {
        now: new Date(now).toLocaleString(),
        registrationStartDate: activity.registrationStartDate,
        registrationOpenTime: new Date(debugOpenTime).toLocaleString(),
        registrationDeadline: activity.registrationDeadline,
        isAutoOpen: now >= debugOpenTime ? "YES - AUTO OPENED" : "NO - WAITING",
        adminRegistrationOpen: activity.registrationOpen,
        eventStartTime: new Date(startTime).toLocaleString(),
        eventStatus: now > startTime ? "EVENT STARTED" : "EVENT NOT STARTED",
      });

      // Cek apakah kegiatan sudah lewat
      if (now > startTime) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setStatus("closed");
        return;
      }

      // AUTO-OPEN: Logika otomatis membuka pendaftaran berdasarkan registrationStartDate

      // Tentukan waktu pembukaan pendaftaran
      let openTime: number;
      if (activity.registrationStartDate) {
        openTime = new Date(activity.registrationStartDate).getTime();
      } else {
        // Fallback: pembukaan registrasi besok jam 00:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        openTime = tomorrow.getTime();
      }

      // Cek apakah waktu pembukaan sudah tiba (otomatis terbuka)
      const isRegistrationTimeOpen = now >= openTime;

      if (!isRegistrationTimeOpen) {
        // Waktu pembukaan belum tiba - tampilkan countdown
        const difference = openTime - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setStatus("waiting");
      } else {
        // Waktu pembukaan sudah tiba - cek status pendaftaran

        // Cek apakah registrationDeadline valid dan masih berlaku
        if (!activity.registrationDeadline) {
          // Jika tidak ada deadline, anggap masih terbuka
          console.log("Registration is open - no deadline set");
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setStatus("open");
        } else if (closeTime <= now) {
          // Deadline sudah lewat - tutup pendaftaran
          console.log("Registration is closed - deadline has passed");
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setStatus("closed");
        } else {
          // Registrasi terbuka - countdown ke deadline
          const difference = closeTime - now;
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
          setStatus("open");
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [activity, closeDate]);

  return (
    <main className="bg-[linear-gradient(to_bottom,#FFE8DB_70%,#E4C6BE_80%,#994555_85%,#732E39_90%,#4B061A_100%)] pt-10 sm:pt-12 md:pt-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {loading ? (
          <div className="text-center">
            <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-[#4B061A] mb-3">
              Memuat...
            </h1>
            <div className="w-24 md:w-32 h-1 bg-[#4B061A] mx-auto rounded-full"></div>
          </div>
        ) : activity ? (
          <>
            {/* Dynamic Title */}
            <div className="md:mb-2">
              <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-[#4B061A] mb-3">
                {activity.title}
              </h1>
              <div className="w-24 md:w-32 h-1 bg-[#4B061A] mx-auto rounded-full"></div>
            </div>

            {/* Banner Image */}
            <div className="mb-12">
              <div className="relative w-full h-48 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                <Image
                  src={activity.image || "/image/Home/Banner 1.png"}
                  alt={`Banner ${activity.title}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-[#4B061A] mb-3">
              Tidak Ada Kegiatan Aktif
            </h1>
            <div className="w-24 md:w-32 h-1 bg-[#4B061A] mx-auto rounded-full"></div>
            <p className="text-lg text-[#FFFFFF] mt-4">
              Saat ini belum ada kegiatan yang tersedia untuk pendaftaran.
            </p>
          </div>
        )}

        {/* Countdown Timer & Registration Info */}
        {activity && (
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-[#4B061A] mb-6">
              {status === "waiting" &&
                (timeLeft.days > 0 ||
                timeLeft.hours > 0 ||
                timeLeft.minutes > 0 ||
                timeLeft.seconds > 0
                  ? "Pendaftaran Otomatis Dibuka Dalam:"
                  : "Pendaftaran Segera Dibuka")}
              {status === "open" &&
                (timeLeft.days > 0 ||
                timeLeft.hours > 0 ||
                timeLeft.minutes > 0 ||
                timeLeft.seconds > 0
                  ? "Pendaftaran Berakhir Dalam:"
                  : "Pendaftaran Sedang Dibuka")}
              {status === "closed" &&
                (new Date().getTime() > new Date(activity.startDate).getTime()
                  ? "Kegiatan Telah Berakhir"
                  : "Pendaftaran Telah Ditutup")}
            </h3>

            {/* Registration Stats */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/30 shadow-lg max-w-md mx-auto">
              <div className="text-lg font-semibold text-[#4B061A] mb-2">
                Slot Tersedia
              </div>
              <div className="text-2xl font-bold text-[#732E39]">
                {activity._count.registrations} / {activity.maxParticipants}{" "}
                terdaftar
              </div>
              <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                <div
                  className="bg-[#4B061A] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (activity._count.registrations /
                        activity.maxParticipants) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            {(status === "waiting" || status === "open") &&
              (timeLeft.days > 0 ||
                timeLeft.hours > 0 ||
                timeLeft.minutes > 0 ||
                timeLeft.seconds > 0) && (
                <div className="flex justify-center gap-4 md:gap-8 mb-8">
                  {[
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/30 shadow-lg"
                    >
                      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4B061A] mb-2">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="text-sm md:text-base font-semibold text-[#732E39]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Registration Button */}
        {activity && (
          <div>
            {status === "waiting" && (
              <div className="inline-flex items-center gap-2 bg-[#FFE8DB] text-black px-8 py-4 rounded-xl font-bold text-lg md:text-xl cursor-not-allowed">
                <UserLock className="w-5 h-5 md:w-6 md:h-6" />
                Belum Dibuka
              </div>
            )}

            {status === "open" &&
              activity._count.registrations < activity.maxParticipants && (
                <Link
                  href="/pendaftaran"
                  className="inline-flex items-center gap-2 bg-[#FFE8DB] text-black px-8 py-4 rounded-xl font-bold text-lg md:text-xl hover:bg-[#FFE8DB]/80 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  <UserRoundPlus className="w-5 h-5 md:w-6 md:h-6" />
                  Daftar Sekarang
                </Link>
              )}

            {status === "open" &&
              activity._count.registrations >= activity.maxParticipants && (
                <div className="inline-flex items-center gap-2 bg-gray-400 text-white px-8 py-4 rounded-xl font-bold text-lg md:text-xl cursor-not-allowed">
                  <UserRoundX className="w-5 h-5 md:w-6 md:h-6" />
                  Slot Penuh
                </div>
              )}

            {status === "closed" && (
              <div className="inline-flex items-center gap-2 bg-[#FFE8DB] text-black px-8 py-4 rounded-xl font-bold text-lg md:text-xl cursor-not-allowed">
                <UserRoundX className="w-5 h-5 md:w-6 md:h-6" />
                Pendaftaran Ditutup
              </div>
            )}

            {status === "waiting" && (
              <p className="mt-4 text-sm md:text-base text-white font-medium">
                {timeLeft.days > 0 ||
                timeLeft.hours > 0 ||
                timeLeft.minutes > 0 ||
                timeLeft.seconds > 0
                  ? "Pendaftaran akan otomatis dibuka pada waktu yang ditentukan. Bersiaplah!"
                  : "Pendaftaran akan segera dibuka otomatis. Pantau terus ya!"}
              </p>
            )}

            {status === "open" &&
              activity._count.registrations < activity.maxParticipants && (
                <p className="mt-4 text-sm md:text-base text-white font-medium">
                  Jangan sampai terlewat! Daftar sebelum waktu dan slot habis.
                </p>
              )}

            {status === "open" &&
              activity._count.registrations >= activity.maxParticipants && (
                <p className="mt-4 text-sm md:text-base text-white font-medium">
                  Maaf, slot pendaftaran sudah penuh. Nantikan kegiatan
                  berikutnya!
                </p>
              )}

            {status === "closed" && (
              <p className="mt-4 text-sm md:text-base text-white font-medium">
                {new Date().getTime() > new Date(activity.startDate).getTime()
                  ? "Kegiatan telah selesai dilaksanakan. Nantikan kegiatan berikutnya!"
                  : new Date().getTime() >
                    new Date(activity.registrationDeadline || "").getTime()
                  ? "Batas waktu pendaftaran telah berakhir."
                  : "Pendaftaran telah ditutup. Nantikan kegiatan berikutnya!"}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
