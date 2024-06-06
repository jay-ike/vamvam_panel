import {
    Badge,
    Button,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Thead,
    Th,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "../../../store";
import { applyFilter, fetchDeliveries, listingActions } from "../../../store/deliveries/listing.ts";
import { DELIVERY_STATUS, DELIVERY_SCHEME } from "../../../helper/enums.ts";
import { useEffect, useState } from "react";
import { DeliveryData, DeliveryFilter } from "../../../models/delivery.ts";
import { getFormatter } from "../../../helper/utils.ts";
import {
    DateRangePicker,
    Location,
    OverviewTableTyped,
    OptionSelector,
    Ratings,
    Sprite,
    UserAvatar
} from "../../../components/UI";

const formatter = getFormatter();
const statusMap = Object.assign({}, DELIVERY_STATUS);
const schemeMap = Object.assign({}, DELIVERY_SCHEME);
const filterOptions = Object.entries(DELIVERY_STATUS).reduce(
    function(acc, [key, val]) {
        if (!key.startsWith("pending")) {
            acc[key] = val;
        }
        return acc;
    },
    Object.create(null)
);

function DeliveryDetails(props: any) {
    return (
        <Modal isOpen={props.opened} onClose={props.onClose} size={"xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><Heading as={"h2"} size={"lg"}>Delivery Summary</Heading></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div className="stack box">
                        <div className="segragator">
                            <Heading as={"h3"} size={"md"}>
                                Status  <Badge p={1.5} borderRadius={".25rem"} colorScheme={schemeMap[props.data.status]}>
                                    {statusMap[props.data.status]}
                                </Badge>
                            </Heading>
                            <Badge colorScheme="whatsapp" p={1.5} borderRadius={".25rem"} >{formatter.formatCurrency(props.data.price ?? "")}</Badge>
                        </div>
                        <Heading as={"h3"} size={"md"}>client informations</Heading>
                        <div className="row wrap fill-evenly">
                            <div className="stack">
                                <Heading as={"h4"} size={"sm"} colorScheme={"facebook"}>SENDER</Heading>
                                <UserAvatar {...props.data.client} />
                            </div>
                            <div className="stack">
                                <Heading as={"h4"} size={"sm"} colorScheme="teal">RECIPIENT</Heading>
                                <UserAvatar {...(props.data.recipientInfos?.main ?? props.data?.recipientInfos ?? {})} />
                            </div>
                        </div>
                        {
                            props.data.driver
                                ? (<>
                                    <Heading as={"h3"} size={"md"}>driver informations</Heading>
                                    <UserAvatar {...props.data.driver} />
                                </>)
                                : ""
                        }
                        <Heading as={"h3"} size={"md"}>route informations</Heading>
                        <div className="row wrap fill-evenly">
                            <div className="stack">
                                <Heading as={"h4"} size={"sm"} colorScheme={"facebook"}>DEPARTURE</Heading>
                                <Location {...props.data.departure} />
                            </div>
                            <div className="stack">
                                <Heading as={"h4"} size={"sm"} colorScheme="teal">DESTINATION</Heading>
                                <Location {...props.data.destination} />
                            </div>
                        </div>
                        <div className="row wrap fill-evenly capitalize">
                            <div className="stack">
                                <Heading as={"h3"} size={"md"}>package type</Heading>
                                <Text>{props.data.packageType}</Text>
                            </div>
                            {
                                props.data.note
                                    ?
                                    <div className="stack">
                                        <Heading as={"h3"} size={"md"} >note</Heading>
                                        <Ratings note={props.data.note} />
                                    </div>
                                    : ""
                            }
                        </div>

                    </div>

                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

function MemberTable(props: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [details, setDetails] = useState({});

    function preview(data: DeliveryData) {
        onOpen();
        setDetails(data);
    }
    return (
        <>
            <DeliveryDetails data={details} opened={isOpen} onClose={onClose} />
            <Table >
                <Thead>
                    <Tr>
                        {(props.colNames ?? []).map((colName: any, index: number) => (
                            <Th key={index}>{colName}</Th>
                        ))
                        }
                    </Tr>
                </Thead>
                <Tbody>
                    {(props.dataSource ?? []).map((data: DeliveryData) => (
                        <Tr key={data.id}>
                            <Td>
                                <UserAvatar {...data.client} />
                            </Td>
                            <Td>
                                <Badge size="sm" p={1.5} borderRadius={".5rem"} colorScheme={schemeMap[data.status]}>
                                    {statusMap[data.status]}
                                </Badge>
                            </Td>
                            <Td>
                                <Location {...data.departure} />
                            </Td>
                            <Td>
                                <Location {...data.destination} />
                            </Td>
                            <Td><Button onClick={() => preview(data)} variant={"ghost"} colorScheme="teal"><Text casing={"capitalize"}>view details</Text></Button></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </>
    );
}

function Deliveries() {
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((rootState: RootState) => rootState.deliveries);
    const { t } = useTranslation();
    const headers = ["client", t("users.status"), t("delivery.departure"), t("delivery.destination"), ""];
    const shownDeliveries = state.deliveries.slice(
        state.pageSize * (state.currentPage - 1),
        state.pageSize * state.currentPage
    );
    const inPrevPage = (
        state.currentPage < Math.ceil(state.deliveries.length / state.pageSize)
    );
    useEffect(function() {
        dispatch(fetchDeliveries({maxPageSize: state.pageSize}));
        return function() {
            dispatch(listingActions.emptyState());
        }
    }, []);

    function handleFiltering(filter: DeliveryFilter) {
        if (
            filter.from === state.filter?.from &&
            filter.to === state.filter?.to &&
            filter.status === state.filter?.status
        ) {
            return;
        }
        dispatch(applyFilter(filter));
        dispatch(fetchDeliveries({
            from: filter.from ?? state.filter?.from,
            maxPageSize: state.pageSize,
            status: filter.status ?? state.filter?.status,
            to: filter.to ?? state.filter?.to
        }));
    }

    function handleNextPage() {
        if (state.deliveries.length === state.pageSize * state.currentPage) {
            dispatch(fetchDeliveries({
                from: state.filter?.from,
                maxPageSize: state.pageSize,
                pageToken: state.pageToken,
                skip: state.refreshed ? state.deliveries.length : undefined,
                status: state.filter?.status,
                to: state.filter?.to
            }));
        } else {
            dispatch(listingActions.setCurrentPage(state.currentPage + 1));
        }
    }

    function previousPage() {
        dispatch(listingActions.setCurrentPage(state.currentPage - 1));
    }

    return (
        <Stack>
            {
                <OverviewTableTyped
                    title={t("delivery.listing")}
                    onNext={(
                        state.paginationCompleted && !inPrevPage
                            ? undefined
                            : handleNextPage
                    )}
                    onPrevious={state.currentPage > 1 ? previousPage : undefined}
                    items={state.deliveries}
                    currentPage={state.currentPage}
                    pageSize={state.pageSize}
                    headerTrailer={
                        <Stack spacing="1rem" direction={{ base: "column", md: "row" }}>
                            <DateRangePicker onRangeChange={(from, to) => handleFiltering({ from, to })} />
                            <OptionSelector title={t("delivery.status_filter")} options={filterOptions} onChange={(status) => handleFiltering({ status })} />
                        </Stack>
                    }
                >
                    {
                        (
                            state.deliveries.length > 0
                                ? <MemberTable colNames={headers} dataSource={shownDeliveries} />
                                : <div className="empty">
                                    <Sprite size={196} name="empty" title="illustration of an empty box" />
                                    <Heading as={"h3"} size={"md"}>{t("delivery.listing_empty_header")}</Heading>
                                    <Text>{t("delivery.listing_empty_content")}</Text>
                                </div>
                        )
                    }
                </OverviewTableTyped>
            }
        </Stack>
    );
}

export default Deliveries;
