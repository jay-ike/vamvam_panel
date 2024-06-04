import React, { useState, useEffect } from 'react';
import {axios} from "../../helper/http";
import { HStack } from '@chakra-ui/react';
import { OverviewTableTyped, DateRangePicker } from '../../components/UI';
import CardOne from '../../components/UI/cards/CardOne';
import { useTranslation } from 'react-i18next';

interface UserStats {
  total: number;
  client: number;
  driver: number;
}

interface TransactionStats {
  bonus: number;
  point: number;
  total: number;
}
interface DeliveriesStats {
  total: number;
  archived: number;
  cancelled: number;
  conflicting: number;
  ongoing: number;
  terminated: number;
}

interface AnalyticsData {
  deliveries: DeliveriesStats;
  users: UserStats;
  transactions: TransactionStats;
}

const HomePage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const { t } = useTranslation();

  const fetchData = async (from?: string, to?: string) => {
    try {
      const response = await axios.get('/user/analytics', {
        params: { from, to },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(fromDate, toDate);
  }, [fromDate, toDate]);

  function handleRangeChange(from: string, to: string) {
      setFromDate(from);
      setToDate(to);
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const userStats = [
    { label: t("home.total_users"), value: data?.users?.total, type:"user" },
    { label: t("home.clients"), value: data?.users?.client, type:"user"  },
    { label: t("home.drivers"), value: data?.users?.driver,type:"user"  },
  ];

  const transactionStats = [
    { label: t("home.total_transactions"), value: data?.transactions?.total, type:"transaction"  },
    { label: t("home.bonus_transactions"), value: data?.transactions?.bonus, type:"transaction"  },
    { label: t("home.point_transactions"), value: data?.transactions?.point, type:"transaction"  },
  ];

  const deliveriesStats = [
    { label: t("home.total_deliveries"), value: data?.deliveries?.total, type:"deliveries"  },
    { label: t("home.archived_deliveries"), value: data?.deliveries?.archived, type:"deliveries"  },
    { label: t("home.cancelled_deliveries"), value: data?.deliveries?.cancelled, type:"deliveries"  },
    { label: t("home.conflicting_deliveries"), value: data?.deliveries?.conflicting, type:"deliveries"  },
    { label: t("home.ongoing_deliveries"), value: data?.deliveries?.ongoing, type:"deliveries"  },
    { label: t("home.terminated_deliveries"), value: data?.deliveries?.terminated, type:"deliveries"  }
  ];

  const stats = [...userStats, ...transactionStats, ...deliveriesStats];

  return (
    <>
    <div className='home'>

      <OverviewTableTyped
        headerTrailer={
          <HStack align="end">
            <DateRangePicker onRangeChange={handleRangeChange} />
          </HStack>
        }
        currentPage={0}
        items={[]}
        title={t("home.home")}
      >
        <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
          {stats.map((stat, index) => (
            <CardOne
              key={index}
              image={
                (stat.type == "deliveries" &&
                <svg className="fill-primary dark:fill-white" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 612 612" >
                  <g>
                    <path d="M482.188,83.333L184.622,223.225v89.832l-51.91-23.082v-89.832L430.278,60.252l-99.946-44.439
                      c-13.383-5.95-35.281-5.95-48.664,0L35.557,125.243C15.95,133.961-0.05,158.649,0,180.107l0.606,256.534
                      c0.051,21.686,16.408,46.401,36.348,54.926L282.42,596.499c12.945,5.534,34.129,5.534,47.075,0.003l245.55-104.936
                      c19.939-8.521,36.297-33.234,36.348-54.919L612,180.107c0.051-21.458-15.949-46.146-35.557-54.864L482.188,83.333z
                      M556.398,288.675l-14.403,6.683l-0.292,101.353c-0.013,4.429-3.925,9.701-8.727,11.773l-21.563,9.309
                      c-4.727,2.041-8.551,0.149-8.554-4.223l-0.073-100.021l-13.951,6.472c-6.562,3.044-10.669-1.729-7.411-8.601l33.348-70.356
                      c3.366-7.102,11.806-11.199,15.184-7.347l34.221,39.012C567.593,276.623,563.257,285.494,556.398,288.675z M415.596,451.443
                      c0.037,4.243-3.55,9.24-8.001,11.162l-19.996,8.632c-4.385,1.893-7.972,0.029-8.022-4.16l-1.171-95.826l-12.938,6.002
                      c-6.085,2.823-9.968-1.808-7.006-8.344l30.31-66.881c3.057-6.747,10.873-10.541,14.062-6.805l32.301,37.836
                      c3.226,3.777-0.712,12.202-7.062,15.147l-13.338,6.188L415.596,451.443z M580.201,423.619c-0.015,2.226-2.016,4.865-4.468,5.896
                      l-228.395,95.95c-2.131,0.896-3.884-0.043-3.915-2.096l-0.175-11.162c-0.032-2.058,1.67-4.463,3.805-5.372l228.802-97.467
                      c2.455-1.046,4.438-0.086,4.423,2.146L580.201,423.619z"/>
                  </g>
                  </svg> )
                || (stat.type == "transaction" &&
                <svg
                  className="fill-primary dark:fill-white"
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
                    fill=""
                  />
                  <path
                    d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                    fill=""
                  />
                </svg> )
                ||
                (stat.type == "user" &&
                <svg className="fill-primary dark:fill-white" enable-background="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M9,9c0-1.7,1.3-3,3-3s3,1.3,3,3c0,1.7-1.3,3-3,3S9,10.7,9,9z M12,14c-4.6,0-6,3.3-6,3.3V19h12v-1.7C18,17.3,16.6,14,12,14z   "/></g><g><g><circle cx="18.5" cy="8.5" r="2.5"/></g><g><path d="M18.5,13c-1.2,0-2.1,0.3-2.8,0.8c2.3,1.1,3.2,3,3.2,3.2l0,0.1H23v-1.3C23,15.7,21.9,13,18.5,13z"/></g></g><g><g><circle cx="18.5" cy="8.5" r="2.5"/></g><g><path d="M18.5,13c-1.2,0-2.1,0.3-2.8,0.8c2.3,1.1,3.2,3,3.2,3.2l0,0.1H23v-1.3C23,15.7,21.9,13,18.5,13z"/></g></g><g><g><circle cx="5.5" cy="8.5" r="2.5"/></g><g><path d="M5.5,13c1.2,0,2.1,0.3,2.8,0.8c-2.3,1.1-3.2,3-3.2,3.2l0,0.1H1v-1.3C1,15.7,2.1,13,5.5,13z"/></g></g></svg>)
              }
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </OverviewTableTyped>
    </div>
    </>
  );
};

export default HomePage;
