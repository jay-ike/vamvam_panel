import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useCallback, useEffect } from "react";
import { PAGE_LIMIT } from "../../../helper";
import {
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Th,
  Tr,
  HStack,
  // Badge,
} from "@chakra-ui/react";
import { CircularLoader, OverviewTableTyped } from "../../../components/UI";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUsersSponsoredList } from "../../../store/sponsors/users-sponsored/user-sponsored-actions";
import UserData from "../../../models/auth/user-data";
import { usersponsoredActions } from "../../../store/sponsors/users-sponsored/user-sponsored-slice";

const SponsoredUsersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const params= useParams()

  const {
    initialReqSent,
    usersSponsored: totalUsers,
    loading,
    pageToken,
    refreshed,
    currentPage,
  } = useSelector((state: RootState) => state.userSponsored);
  const { linearLoaderVisible } = useSelector((state: RootState) => state.ui);
  const displayedUsers = totalUsers.slice(
    PAGE_LIMIT * (currentPage - 1),
    PAGE_LIMIT * currentPage
  );

  const fetchUsers = useCallback(() => {
    dispatch(fetchUsersSponsoredList({id:params?.id}));
  }, [dispatch,params?.id]);

  const clearState = useCallback(() => {
    dispatch(usersponsoredActions.emptyState());
  }, [dispatch]);

  useEffect(() => {
    fetchUsers();
    return () => {
      clearState();
    };
  }, [clearState, fetchUsers]);

  const navigate = useNavigate();

  function handleNextPage() {
    if (linearLoaderVisible) return;
    if (totalUsers.length == PAGE_LIMIT * currentPage) {
      dispatch(
        fetchUsersSponsoredList({
          pageToken: pageToken,
          skip: refreshed ? totalUsers.length : undefined,
          id:params?.id
        })
      );
    } else {
      dispatch(usersponsoredActions.changeCurrentPage(currentPage + 1));
    }
  }

  function handlePreviousPage() {
    if (linearLoaderVisible) return;
    dispatch(usersponsoredActions.changeCurrentPage(currentPage - 1));
  }

  function handleViewDetails(user: UserData) {
    navigate('/admin/edit-user',{state:user})
  }

  const showNext = displayedUsers.length === PAGE_LIMIT;
  const showPrevious = currentPage > 1;
  const tableColumns = [
    t("sponsor.firstName"),
    t("sponsor.lastName"),
    t("sponsor.phone"),
  ];

  return loading && !initialReqSent ? (
    <CircularLoader />
  ) : (
    <>
      <OverviewTableTyped
        currentPage={currentPage}
        onNext={showNext ? handleNextPage : undefined}
        onPrevious={showPrevious ? handlePreviousPage : undefined}
        items={totalUsers}
        title={t("sponsor.users_sponsored_list")}
      >
        <Table>
          <Thead>
            <Tr>
              {tableColumns.map((colName: any, index: number) => (
                <Th key={index}>{colName}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {displayedUsers.map((member) => (
              <Tr
                key={member.id}
                _hover={{ cursor: "pointer" }}
                onClick={() => handleViewDetails(member)}
              >
                <Td>
                  <HStack spacing="3">
                    <Text fontWeight="medium">{member?.firstName}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.lastName}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.phone}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </OverviewTableTyped>
    </>
  );
};

export default SponsoredUsersPage;
