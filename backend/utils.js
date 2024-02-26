function getWindDirection(degrees) {
  while (degrees > 360) {
    degrees -= 360;
  }

  while (degrees < 0) {
    degrees += 360;
  }

  if (degrees > 337.5) return "N";
  if (degrees > 292.5) return "NW";
  if (degrees > 247.5) return "W";
  if (degrees > 202.5) return "SW";
  if (degrees > 157.5) return "S";
  if (degrees > 122.5) return "SE";
  if (degrees > 67.5) return "E";
  if (degrees > 22.5) return "NE";
  return "N";
}
function convertToDate(dateString) {
  // Create a new Date object by parsing the input date string
  const date = new Date(dateString);

  // Extract the year, month, and day from the Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, "0");

  // Format the date in the desired format (YYYY-MM-DD)
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

function getCurrentTimeString() {
  const now = new Date();

  const timeString = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${timeString}, ${dateString}`;
}

module.exports = {
  getWindDirection,
  getCurrentTimeString,
  convertToDate,
};
