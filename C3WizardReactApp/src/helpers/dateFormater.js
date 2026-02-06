const formatDate = (dateStr) => {
    const [day, month, year] = dateStr?.split("-");
    return `${year}-${month}-${day}`;
};


export const formatDateDDMMMYYYY = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/\s/g, "-");
  };
  
export default formatDate