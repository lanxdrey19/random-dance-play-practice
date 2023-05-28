import Link from "next/link";

const API_KEY = "YOUR_WEATHER_API_KEY";
const CITY_NAME = "YOUR_CITY_NAME";

const HomePage = () => {
  return (
    <>
      <h1>Goodbye, Next.js!</h1>
      <Link href="/practice">Practice</Link>
      <Link href="/weather">Weather</Link>
    </>
  );
};

export default HomePage;
