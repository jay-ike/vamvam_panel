import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useCallback, useEffect } from "react";
import { fetchTransactionsList } from "../../../store/transactions/transactions-actions";
import { transactionActions } from "../../../store/transactions/transaction-slice";
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
  Avatar,
  Select
} from "@chakra-ui/react";
import { CircularLoader, OverviewTableTyped } from "../../../components/UI";
import TransactionData from "../../../models/transactions/transaction-data";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getFilePath } from "../../../helper/utils";

const TransactionsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    initialReqSent,
    transactions: totalTransactions,
    loading,
    pageToken,
    refreshed,
    currentPage,
    prevType
  } = useSelector((state: RootState) => state.transactions);
  const { linearLoaderVisible } = useSelector((state: RootState) => state.ui);
  const displayedTransactions = totalTransactions.slice(
    PAGE_LIMIT * (currentPage - 1),
    PAGE_LIMIT * currentPage
  );



  const fetchTransactions = useCallback(() => {
    dispatch(fetchTransactionsList({}));
  }, [dispatch]);

  const clearState = useCallback(() => {
    dispatch(transactionActions.emptyState());
  }, [dispatch]);

  useEffect(() => {
    fetchTransactions();
    return () => {
      clearState();
    };
  }, [clearState, fetchTransactions]);

  const navigate = useNavigate();

  function handleNextPage() {
    if (linearLoaderVisible) return;
    if (totalTransactions.length == PAGE_LIMIT * currentPage) {
      dispatch(
        fetchTransactionsList({
          pageToken: pageToken,
          type: prevType,
          skip: refreshed ? totalTransactions.length : undefined
        })
      );
    } else {
      dispatch(transactionActions.changeCurrentPage(currentPage + 1));
    }
  }

  function handlePreviousPage() {
    if (linearLoaderVisible) return;
    dispatch(transactionActions.changeCurrentPage(currentPage - 1));
  }

  function handleViewDetails(transaction: TransactionData) {
    navigate('/admin/transaction/'+transaction.id)
  }


  function handleTypeChange(type: string) {
    if (type === prevType) return;
    if (type !== prevType) {
      dispatch(transactionActions.changeTransactions([]));
    }
    dispatch(transactionActions.changeTypes(type));
    dispatch(fetchTransactionsList({type}));
  }

  const showNext = displayedTransactions.length === PAGE_LIMIT;
  const showPrevious = currentPage > 1;
  const tableColumns = [
    t("transaction.avatar"),
    t("transaction.bonus"),
    t("transaction.amount"),
    t("transaction.date"),
    t("transaction.point"),
  ];

  return loading && !initialReqSent ? (
    <CircularLoader />
  ) : (
    <>
      <OverviewTableTyped
        currentPage={currentPage}
        onNext={showNext ? handleNextPage : undefined}
        onPrevious={showPrevious ? handlePreviousPage : undefined}
        items={totalTransactions}
        title={t("transaction.transactions_list")}
        headerTrailer={
          <HStack align="end">
              <Select onChange={(event:any) => handleTypeChange!(event.target.value)}>
                {["recharge", "withdrawal"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
                )}
              </Select>
          </HStack>
        }
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
            {displayedTransactions.map((member) => (
              <Tr
                key={member?.id}
                _hover={{ cursor: "pointer" }}
                onClick={() => handleViewDetails(member)}
              >
                <Td>
                <HStack spacing="3">
                    <Avatar
                      src={getFilePath(member.avatar as string)}
                      boxSize="10"
                    />
                    <Text fontWeight="medium">{member.firstName}</Text>
                    <Text fontWeight="medium">{member.lastName}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.bonus}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.amount}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.date}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.firstName}</Text>
                </Td>
                <Td>
                  <Text color="fg.muted">{member?.point}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </OverviewTableTyped>
    </>
  );
};

export default TransactionsPage;
