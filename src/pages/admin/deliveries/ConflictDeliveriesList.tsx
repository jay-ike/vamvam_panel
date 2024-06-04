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
} from "@chakra-ui/react";
import { CircularLoader, OverviewTableTyped } from "../../../components/UI";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchconflictdeliverysList } from "../../../store/conflictdeliveries/conflictdelivery-actions";
import ConflictDeliveryData from "../../../models/deliveries/conflictdelivery";
import { conflictdeliveryActions } from "../../../store/conflictdeliveries/conflictdelivery-slice";

const ConflictDeliveriesPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    initialReqSent,
    conflictdeliveries: totalConflictDeliveries,
    loading,
    pageToken,
    refreshed,
    currentPage,
  } = useSelector((state: RootState) => state.conflictdeliveries);
  const { linearLoaderVisible } = useSelector((state: RootState) => state.ui);
  const displayedConflictDeliveries = totalConflictDeliveries.slice(
    PAGE_LIMIT * (currentPage - 1),
    PAGE_LIMIT * currentPage
  );

  const fetchConflictDeliveries = useCallback(() => {
    dispatch(fetchconflictdeliverysList({}));
  }, [dispatch]);

  const clearState = useCallback(() => {
    dispatch(conflictdeliveryActions.emptyState());
  }, [dispatch]);

  useEffect(() => {
    fetchConflictDeliveries();
    return () => {
      clearState();
    };
  }, [clearState, fetchConflictDeliveries]);

  const navigate = useNavigate();

  function handleNextPage() {
    if (linearLoaderVisible) return;
    if (totalConflictDeliveries.length == PAGE_LIMIT * currentPage) {
      dispatch(
        fetchconflictdeliverysList({
          pageToken: pageToken,
          skip: refreshed ? totalConflictDeliveries.length : undefined,
        })
      );
    } else {
      dispatch(conflictdeliveryActions.changeCurrentPage(currentPage + 1));
    }
  }

  function handlePreviousPage() {
    if (linearLoaderVisible) return;
    dispatch(conflictdeliveryActions.changeCurrentPage(currentPage - 1));
  }

  function handleViewDetails(conflictdelivery: ConflictDeliveryData) {
    navigate('/admin/edit-bundle',{state:conflictdelivery})
  }

  const showNext = displayedConflictDeliveries.length === PAGE_LIMIT;
  const showPrevious = currentPage > 1;
  const tableColumns = [
    t("bundle.bonus"),
    t("bundle.gainMin"),
    t("bundle.point"),
    t("bundle.price"),
    t("bundle.unitPrice"),
  ];

  return loading && !initialReqSent ? (
    <CircularLoader />
  ) : (
    <>
      <OverviewTableTyped
        currentPage={currentPage}
        onNext={showNext ? handleNextPage : undefined}
        onPrevious={showPrevious ? handlePreviousPage : undefined}
        items={totalConflictDeliveries}
        title={t("bundle.bundles_list")}
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
            {displayedConflictDeliveries.map((member) => (
              <Tr
                key={member?.id}
                _hover={{ cursor: "pointer" }}
                onClick={() => handleViewDetails(member)}
              >
                <Td>
                  <HStack spacing="3">
                    <Text fontWeight="medium">{member?.price}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.status}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.driver?.firstName}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.client?.firstName}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.reporter?.firstName}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </OverviewTableTyped>
    </>
  );
};

export default ConflictDeliveriesPage;
