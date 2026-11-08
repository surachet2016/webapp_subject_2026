fetch("customer_json.php")
  .then((res) => {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  })
  .then((data) => {
    data.forEach((c) => console.log(c.CustomerID, c.Name));
  })
  .catch((err) => console.error("เกิดข้อผิดพลาด", err));
