import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useCallback, useEffect } from "react";
import { fetchSponsorsList } from "../../../store/sponsors/sponsors-actions";
import { sponsorActions } from "../../../store/sponsors/sponsor-slice";
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
import SponsorData from "../../../models/sponsors/sponsor-data";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SponsorsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    initialReqSent,
    sponsors: totalSponsors,
    loading,
    pageToken,
    refreshed,
    currentPage,
  } = useSelector((state: RootState) => state.sponsors);
  const { linearLoaderVisible } = useSelector((state: RootState) => state.ui);
  const displayedSponsors = totalSponsors.slice(
    PAGE_LIMIT * (currentPage - 1),
    PAGE_LIMIT * currentPage
  );

  const fetchSponsors = useCallback(() => {
    dispatch(fetchSponsorsList({}));
  }, [dispatch]);

  const clearState = useCallback(() => {
    dispatch(sponsorActions.emptyState());
  }, [dispatch]);

  useEffect(() => {
    fetchSponsors();
    return () => {
      clearState();
    };
  }, [clearState, fetchSponsors]);

  const navigate = useNavigate();

  function handleNextPage() {
    if (linearLoaderVisible) return;
    if (totalSponsors.length == PAGE_LIMIT * currentPage) {
      dispatch(
        fetchSponsorsList({
          pageToken: pageToken,
          skip: refreshed ? totalSponsors.length : undefined,
        })
      );
    } else {
      dispatch(sponsorActions.changeCurrentPage(currentPage + 1));
    }
  }

  function handlePreviousPage() {
    if (linearLoaderVisible) return;
    dispatch(sponsorActions.changeCurrentPage(currentPage - 1));
  }

  function handleViewDetails(sponsor: SponsorData) {
    navigate('/admin/sponsor/'+sponsor.sponsor.id)
  }

  const showNext = displayedSponsors.length === PAGE_LIMIT;
  const showPrevious = currentPage > 1;
  const tableColumns = [
    t("sponsor.code"),
    t("sponsor.name"),
    t("sponsor.phone"),
    t("sponsor.sponsored"),
  ];

  return loading && !initialReqSent ? (
    <CircularLoader />
  ) : (
    <>
      <OverviewTableTyped
        currentPage={currentPage}
        onNext={showNext ? handleNextPage : undefined}
        onPrevious={showPrevious ? handlePreviousPage : undefined}
        items={totalSponsors}
        title={t("sponsor.sponsors_list")}
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
            {displayedSponsors.map((member) => (
              <Tr
                key={member?.sponsor?.id}
                _hover={{ cursor: "pointer" }}
                onClick={() => handleViewDetails(member)}
              >
                <Td>
                  <HStack spacing="3">
                    <Text fontWeight="medium">{member?.sponsor?.code}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.sponsor?.name}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.sponsor?.phone}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.sponsored}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </OverviewTableTyped>
    </>
  );
};

export default SponsorsPage;
