const fs = require("fs"); //odczytuje plik cvs ha
const csv = require("csv-parser");

function proxyListReader(cvsFilePath) {
  return new Promise((resolve, reject) => {
    const proxies = [];

    fs.createReadStream(cvsFilePath)
      .pipe(csv()) // cvs parser pipe przenosi dane miedzy cvs a node
      .on("data", (data) => {
        const { ip, port, protocols, country, speed, org } = data;
        const proxy = {
          ip: ip,
          port: port,
          protocol: protocols,
          country: country,
          speed: speed,
          org: org,
        };
        proxies.push(proxy);
      })
      .on("end", () => {
        resolve(proxies);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function main() {
  const cvsFilePath = "Free_Proxy_List.csv";
  try {
    const proxyList = await proxyListReader(cvsFilePath);

    proxyList.forEach((proxy) => {
      console.log(proxy);
    });
  } catch (error) {
    console.error("Error: cant read proxy list :( :", error);
  }
}

main();
