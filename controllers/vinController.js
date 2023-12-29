const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");

dotenv.config();

const API_BASE_URL = process.env.DECODE_BASE_URL;
const id = process.env.DECODE_ID;
const secretKey = process.env.DECODE_SECRET;

const createAxiosInstance = () => {
  return axios.create({
    maxBodyLength: Infinity,
    headers: {},
  });
};

const generateKey = (str4key, secretKey) => {
  return str4key + secretKey;
};

const generateMD5Hash = (key) => {
  return crypto.createHash("md5").update(key).digest("hex");
};

const authVIN = async () => {
  try {
    const response = await createAxiosInstance().get(
      `${API_BASE_URL}?id=${id}&decoder&auth`
    );
    return response.data.access.str4key;
  } catch (error) {
    console.error("Error in authVIN:", error.message);
    throw error;
  }
};

const decode = async (vin, key) => {
  try {
    const response = await createAxiosInstance().get(
      `${API_BASE_URL}?id=${id}&vin=${vin}&key=${key}&decoder`
    );
    return response.data;
  } catch (error) {
    console.error("Error in decode:", error.message);
    throw error;
  }
};

const decodeVIN = async (req, res) => {
  try {
    const { vin } = req.body;
    const str4key = await authVIN();
    const key = generateKey(str4key, secretKey);
    const md5Hash = generateMD5Hash(key);

    const decodedData = await decode(vin, md5Hash);

    res.status(200).json({ car: decodedData });
  } catch (error) {
    console.error("Error in decodeVIN:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  decodeVIN,
};
