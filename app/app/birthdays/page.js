"use client";

import Link from "next/link";

const fetchBirthdays = async () => {
  try {
    const response = await fetch(
      process.env.LOCALHOST_BASE_URL + "birthdays/members"
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching birthdays:", error);
  }
};

const fetchBirthdayDate = async () => {
  try {
    const response = await fetch(
      process.env.LOCALHOST_BASE_URL + "birthdays/date"
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching birthday date:", error);
  }
};

export default async function Birthdays() {
  const birthdayMembers = await fetchBirthdays();
  const dateData = await fetchBirthdayDate();

  return (
    <>
      <Link href="/">Home</Link>

      <h3>{dateData[0]?.date} Birthdays</h3>
      <ul>
        {birthdayMembers.map((member) => (
          <li key={member.idolName}>
            <p>
              {member.idolName} {member.group ? "(" + member.group + ")" : ""}
            </p>
            <img src={member.imgSrc} alt={member.idolName} />
          </li>
        ))}
      </ul>
    </>
  );
}
