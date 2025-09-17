import { useState, useEffect } from "react";
import { format } from "date-fns";

function DisplayTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = format(now, "do MMM yyyy | hh:mm:ss a"); 
      // Output will be: "16th Sep 2025 | 12:40:21 PM"
      setTime(formatted);
    };

    updateClock(); // run immediately on mount
    const timer = setInterval(updateClock, 1000); // update every second

    return () => clearInterval(timer); // cleanup
  }, []);

  return <div>{time}</div>;
}

export default DisplayTime;
