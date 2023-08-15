export default {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express server",
      version: "1.0",
      description: "Hing",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Geunyoung Park",
        url: "https://github.com/geunza",
        email: "safa940812@naver.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/",
      },
    ],
  },
  apis: ["./routes/**/*.ts"],
};
