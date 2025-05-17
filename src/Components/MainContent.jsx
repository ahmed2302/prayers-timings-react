import {
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import Prayers from "./Prayers";
import fajrImg from "../assets/fajr-prayer.png";
import dhhrImg from "../assets/dhhr-prayer-mosque.png";
import asrImg from "../assets/asr-prayer-mosque.png";
import sunsetImg from "../assets/sunset-prayer-mosque.png";
import nightImg from "../assets/night-prayer-mosque.png";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MainContent() {
  const handleChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const egyptianCities = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "بورسعيد",
    "السويس",
    "المنصورة",
    "طنطا",
    "دمياط",
    "الإسماعيلية",
    "الفيوم",
    "بني سويف",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "الأقصر",
    "أسوان",
    "شرم الشيخ",
    "الغردقة",
    "مرسى مطروح",
    "الأقصر",
    "الزقازيق",
    "كفر الشيخ",
    "شبين الكوم",
    "سوهاج",
    "بنها",
    "دمنهور",
    "المنصورة",
    "بورسعيد",
    "دمياط",
    "العريش",
    "رفح",
    "السويس",
    "الإسماعيلية",
  ];
  const formatDateTime = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // الأشهر تبدأ من 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
  };
  const [selectedCity, setSelectedCity] = useState("سوهاج");
  const [timings, setTimings] = useState({
    Fajr: "04:30",
    Dhuhr: "12:00",
    Asr: "15:30",
    Maghrib: "18:45",
    Isha: "20:15",
    Day: "السبت",
    TodayDate: formatDateTime(new Date()),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimings((prevTimings) => ({
        ...prevTimings,
        TodayDate: formatDateTime(new Date()),
      }));
    }, 1000);

    return () => clearInterval(interval); // لتنظيف المؤقت عند إلغاء تحميل المكون
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity}`
      )
      .then((res) => {
        const data = res.data.data.timings;
        // console.log(res);
        setTimings({
          Fajr: data.Fajr,
          Dhuhr: data.Dhuhr,
          Asr: data.Asr,
          Maghrib: data.Maghrib,
          Isha: data.Isha,
          TodayDate: formatDateTime(new Date()),
          Day: res.data.data.date.hijri.weekday.ar,
        });
      });
  }, [selectedCity]);
  // ========================================

  const getNextPrayer = (timings) => {
    const current = new Date();
    const currentTime = current.getHours() * 60 + current.getMinutes();

    const prayers = [
      { name: "الفجر", time: timings.Fajr },
      { name: "الظهر", time: timings.Dhuhr },
      { name: "العصر", time: timings.Asr },
      { name: "المغرب", time: timings.Maghrib },
      { name: "العشاء", time: timings.Isha },
    ];

    for (let i = 0; i < prayers.length; i++) {
      const [hours, minutes] = prayers[i].time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;
      if (currentTime < prayerTime) {
        return prayers[i];
      }
    }

    // If current time is past Isha, the next prayer is Fajr on the next day
    return prayers[0];
  };

  const calculateTimeDifference = (current, target) => {
    const differenceInSeconds = target - current;
    const hours = Math.floor(differenceInSeconds / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds = differenceInSeconds % 60;
    return { hours, minutes, seconds };
  };

  const formatTimeLeft = (hours, minutes, seconds) => {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const nextPrayer = getNextPrayer(timings);
  const current = new Date();
  const nextPrayerDate = new Date();
  const [nextHours, nextMinutes] = nextPrayer.time.split(":").map(Number);
  nextPrayerDate.setHours(nextHours);
  nextPrayerDate.setMinutes(nextMinutes);
  nextPrayerDate.setSeconds(0);

  const currentTimeInSeconds =
    current.getHours() * 3600 +
    current.getMinutes() * 60 +
    current.getSeconds();
  const nextPrayerTimeInSeconds =
    nextPrayerDate.getHours() * 3600 +
    nextPrayerDate.getMinutes() * 60 +
    nextPrayerDate.getSeconds();

  let timeLeftInSeconds = nextPrayerTimeInSeconds - currentTimeInSeconds;
  if (timeLeftInSeconds < 0) {
    timeLeftInSeconds += 24 * 3600; // Add 24 hours in seconds if next prayer is the next day
  }

  const timeLeft = calculateTimeDifference(0, timeLeftInSeconds);
  const formattedTimeLeft = formatTimeLeft(
    timeLeft.hours,
    timeLeft.minutes,
    timeLeft.seconds
  );
  // ========================================
  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        style={{ marginTop: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ width: "50%" }}>
          <h2>{timings.TodayDate}</h2>
          <h1>
            {selectedCity} | {timings.Day}
          </h1>
        </div>
        <div>
          <h2>متبقي حتي صلاة {nextPrayer.name}</h2>
          <h1>{formattedTimeLeft}</h1>
        </div>
      </Stack>
      <Divider style={{ borderColor: "#fff", opacity: "0.1" }} />
      <Stack
        justifyContent="center"
        direction="row"
        style={{ marginTop: "30px", flexWrap: "wrap", gap: "20px" }}>
        <Prayers time={timings.Fajr} img={dhhrImg} name="الفجر" />
        <Prayers time={timings.Dhuhr} img={fajrImg} name="الظهر" />
        <Prayers time={timings.Asr} img={asrImg} name="العصر" />
        <Prayers time={timings.Maghrib} img={sunsetImg} name="المغرب" />
        <Prayers time={timings.Isha} img={nightImg} name="العشاء" />
      </Stack>
      <Stack
        direction="row"
        justifyContent="center"
        style={{ marginTop: "30px" }}>
        <FormControl style={{ width: "250px" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "#fff" }}>المدينة</span>
          </InputLabel>
          <Select
            style={{ fontSize: "22px" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCity}
            label="المدينة"
            onChange={handleChange}>
            {egyptianCities.map((city, index) => (
              <MenuItem style={{ fontSize: "22px" }} key={index} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Container>
  );
}
