import SSLCommerzPayment from "sslcommerz-lts";

const sslCommerzConfig = {
  store_id: process.env.SSL_STORE_ID,
  store_passwd: process.env.SSL_STORE_PASS,
  is_live: false, //true for live, false for sandbox
};

const sslInit = async (data) => {
  const sslcz = new SSLCommerzPayment(
    sslCommerzConfig.store_id,
    sslCommerzConfig.store_passwd,
    sslCommerzConfig.is_live
  );

  try {
    const response = await sslcz.init(data);
    return response;
  } catch (error) {
    console.log("payment initialization error", error);
  }
};

export { sslCommerzConfig, sslInit };
