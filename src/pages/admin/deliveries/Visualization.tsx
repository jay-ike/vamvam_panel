import { useTranslation } from "react-i18next";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GoogleMap } from "../../../components/UI";
import { AppDispatch, RootState } from "../../../store";
import { fetchDrivers } from "../../../store/users/drivers-listing";

function DriverVisualization() {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((rootstate: RootState) => rootstate.drivers);

    useEffect(function() {
        dispatch(fetchDrivers({}));
    }, []);

    function handleDriverLoad() {
        if (!state.paginationCompleted) {
            dispatch(fetchDrivers({
                pageToken: state.pageToken,
                skip: state.refreshed ? state.drivers.length : undefined
            }));
        }
    }
    return (
        <Stack>
            <Stack direction={"row"} justify={"space-between"}>
                <Heading as={"h2"}>{t("delivery.map_heading")}</Heading>
                {
                    !state.paginationCompleted &&
                    <Button onClick={handleDriverLoad} colorScheme={"facebook"}>Load More Drivers</Button>
                }
            </Stack>
            <Box height={"70lvb"} maxH={"80lvb"}>
                <GoogleMap drivers={state.drivers} />
            </Box>
        </Stack>
    );

}

export default DriverVisualization;
