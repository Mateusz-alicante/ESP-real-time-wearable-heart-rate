import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  ResponsiveContainer,
  Area,
} from "recharts";

import { IoIosWarning } from "react-icons/io";

import { IconContext } from "react-icons";

import styles from "./Home.module.css";

export default function Home({ data, emergency }) {
  return (
    <>
      {emergency && (
        <div className={styles.emergencycontainer}>
          <IconContext.Provider value={{ color: "red", size: "3em" }}>
            <IoIosWarning />
          </IconContext.Provider>
          <h1>EMERGENCY</h1>
        </div>
      )}
      <div className={styles.container}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart width={300} height={100} data={data}>
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#8884d8"
              fill="#d90429"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
//
