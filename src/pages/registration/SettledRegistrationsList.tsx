import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useCallback, useEffect } from "react";
import { PAGE_LIMIT } from "../../helper";
import {
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Th,
  Tr,
  Badge,
  Image,
} from "@chakra-ui/react";
import { CircularLoader, OverviewTableTyped } from "../../components/UI";
import { useTranslation } from "react-i18next";
import { settledRegistrationActions } from "../../store/registration/settled/slice";
import { RegistrationData } from "../../models/registrations/registration-data";
import { formatDate } from "../../helper/utils";
import { useNavigate } from "react-router-dom";
import { fetchSettledRegistrations } from "../../store/registration/settled/actions";
import SettledFilters from "../../components/registrations/SettledFilter";
import emptyImage from "../../images/empty-registration.png";

const SettledRegistrationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    initialReqSent,
    settledRegistrations: totalSettledRegistrations,
    loading,
    name,
    from,
    to,
    status: prevStatus,
    pageToken,
    refreshed,
    currentPage,
  } = useSelector((state: RootState) => state.settledRegistrations);
  const { linearLoaderVisible } = useSelector((state: RootState) => state.ui);
  const displayedSettledRegistrations = totalSettledRegistrations.slice(
    PAGE_LIMIT * (currentPage - 1),
    PAGE_LIMIT * currentPage
  );

  const fetchSettledRegistrationList = useCallback(() => {
    dispatch(fetchSettledRegistrations({}));
  }, [dispatch]);

  const clearState = useCallback(() => {
    dispatch(settledRegistrationActions.emptyState());
  }, [dispatch]);

  useEffect(() => {
    fetchSettledRegistrationList();
    return () => {
      clearState();
    };
  }, [clearState, fetchSettledRegistrationList]);

  function handleNameChange(name: string) {
    dispatch(settledRegistrationActions.changeName(name));
    dispatch(settledRegistrationActions.changeSettledRegistrations([]));
    dispatch(fetchSettledRegistrations({ name, status: prevStatus, from, to }));
  }

  function handleStatusChange(status: string) {
    if (prevStatus === status) return;
    dispatch(settledRegistrationActions.changeStatus(status));
    dispatch(settledRegistrationActions.changeSettledRegistrations([]));
    dispatch(fetchSettledRegistrations({ name, status, from, to }));
  }

  function handleDateRangeChange(
    startDate: string | undefined,
    endDate: string | undefined
  ) {
    dispatch(
      settledRegistrationActions.changeDateRange({ startDate, endDate })
    );
    dispatch(settledRegistrationActions.changeSettledRegistrations([]));
    dispatch(
      fetchSettledRegistrations({
        from: startDate,
        to: endDate,
        name,
        status: prevStatus,
      })
    );
  }

  function handleNextPage() {
    if (linearLoaderVisible) return;
    if (totalSettledRegistrations.length == PAGE_LIMIT * currentPage) {
      dispatch(
        fetchSettledRegistrations({
          skip: refreshed ? totalSettledRegistrations.length : undefined,
          pageToken: pageToken,
          status: prevStatus,
          name,
          from,
          to,
        })
      );
    } else {
      dispatch(settledRegistrationActions.changeCurrentPage(currentPage + 1));
    }
  }

  function handlePreviousPage() {
    if (linearLoaderVisible) return;
    dispatch(settledRegistrationActions.changeCurrentPage(currentPage - 1));
  }

  function handleViewDetails(registration: RegistrationData) {
    navigate(registration.id!, {
      state: registration,
    });
  }

  const showNext = displayedSettledRegistrations.length === PAGE_LIMIT;
  const showPrevious = currentPage > 1;
  const tableColumns = [
    t("users.first_name"),
    t("users.last_name"),
    "Email",
    t("users.phone"),
    t("registrations.processing_date"),
    t("users.status"),
  ];

  return loading && !initialReqSent ? (
    <CircularLoader />
  ) : (
    <>
      <OverviewTableTyped
        currentPage={currentPage}
        onNext={showNext ? handleNextPage : undefined}
        onPrevious={showPrevious ? handlePreviousPage : undefined}
        items={totalSettledRegistrations}
        title={t("registrations.settled_registrations")}
        headerTrailer={
          <SettledFilters
            onSearch={handleNameChange}
            onDateRangeChange={handleDateRangeChange}
            onSelect={handleStatusChange}
          />
        }
      >
        {displayedSettledRegistrations.length === 0 ? (
          <Image margin="auto" src={emptyImage} />
        ) : (
          <Table>
            <Thead>
              <Tr>
                {tableColumns.map((colName: any, index: number) => (
                  <Th key={index}>{colName}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {displayedSettledRegistrations.map((registration) => (
                <Tr
                  key={registration.id}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => handleViewDetails(registration)}
                >
                  <Td>
                    <Text fontWeight="medium">{registration.firstName}</Text>
                  </Td>
                  <Td>
                    <Text fontWeight="medium" color="fg.muted">
                      {registration.lastName}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontWeight="medium" color="fg.muted">
                      {registration.email}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontWeight="medium" color="fg.muted">
                      {registration.phoneNumber}
                    </Text>
                  </Td>
                  <Td>
                    <Text color="fg.muted">
                      {formatDate(
                        registration.status === "active"
                          ? registration.validationDate
                          : registration.rejectionDate
                      )}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      size="sm"
                      colorScheme={
                        registration.status === "active"
                          ? "green"
                          : registration.status === "pending"
                          ? "blue"
                          : "red"
                      }
                    >
                      {registration.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </OverviewTableTyped>
    </>
  );
};

export default SettledRegistrationsPage;
