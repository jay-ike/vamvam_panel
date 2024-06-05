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
  HStack,
  Badge,
  Image,
} from "@chakra-ui/react";
import { CircularLoader, OverviewTableTyped } from "../../components/UI";
import { useTranslation } from "react-i18next";
import { fetchNewRegistrations } from "../../store/registration/new/actions";
import { newRegistrationActions } from "../../store/registration/new/slice";
import { RegistrationData } from "../../models/registrations/registration-data";
import { formatDate } from "../../helper/utils";
import { useNavigate } from "react-router-dom";
import SearchInput from "../../components/registrations/SearchInput";
import emptyImage from "../../images/empty-registration.png";

const NewRegistrationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    initialReqSent,
    newRegistrations: totalnewRegistrations,
    loading,
    name,
    pageToken,
    refreshed,
    currentPage,
  } = useSelector((state: RootState) => state.newRegistrations);
  const { linearLoaderVisible } = useSelector((state: RootState) => state.ui);
  const displayedNewRegistrations = totalnewRegistrations.slice(
    PAGE_LIMIT * (currentPage - 1),
    PAGE_LIMIT * currentPage
  );

  const fetchNewRegistrationsList = useCallback(() => {
    dispatch(fetchNewRegistrations({}));
  }, [dispatch]);

  const clearState = useCallback(() => {
    dispatch(newRegistrationActions.emptyState());
  }, [dispatch]);

  useEffect(() => {
    fetchNewRegistrationsList();
    return () => {
      clearState();
    };
  }, [clearState, fetchNewRegistrationsList]);

  function handleNameChange(name: string) {
    dispatch(newRegistrationActions.changeName(name));
    dispatch(newRegistrationActions.changeNewRegistrations([]));
    dispatch(fetchNewRegistrations({ name }));
  }

  function handleNextPage() {
    if (linearLoaderVisible) return;
    if (totalnewRegistrations.length == PAGE_LIMIT * currentPage) {
      dispatch(
        fetchNewRegistrations({
          pageToken: pageToken,
          name: name,
          skip: refreshed ? totalnewRegistrations.length : undefined,
        })
      );
    } else {
      dispatch(newRegistrationActions.changeCurrentPage(currentPage + 1));
    }
  }

  function handlePreviousPage() {
    if (linearLoaderVisible) return;
    dispatch(newRegistrationActions.changeCurrentPage(currentPage - 1));
  }

  function handleViewDetails(registration: RegistrationData) {
    navigate(registration.id!, {
      state: registration,
    });
  }

  const showNext = displayedNewRegistrations.length === PAGE_LIMIT;
  const showPrevious = currentPage > 1;
  const tableColumns = [
    t("users.first_name"),
    t("users.last_name"),
    "Email",
    t("users.phone"),
    t("registrations.registration_date"),
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
        items={totalnewRegistrations}
        title={t("registrations.new_registrations")}
        headerTrailer={
          <HStack align="end">
            <SearchInput
              onSearch={handleNameChange}
              placeholder={t("registrations.enter_name")}
            />
          </HStack>
        }
      >
        {totalnewRegistrations.length === 0 ? (
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
              {displayedNewRegistrations.map((registration) => (
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
                      {formatDate(registration.registrationDate!)}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      size="sm"
                      colorScheme={
                        registration.contributorId ? "orange" : "blue"
                      }
                    >
                      {registration.contributorId
                        ? "reviewing"
                        : registration.status}
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

export default NewRegistrationsPage;
