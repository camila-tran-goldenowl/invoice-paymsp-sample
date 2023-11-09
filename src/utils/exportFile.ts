const exportToFile = (type: "csv" | "pdf" | "qwc", data: any, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}.${type}`);
  document.body.appendChild(link);
  link.click();
};

export { exportToFile };
