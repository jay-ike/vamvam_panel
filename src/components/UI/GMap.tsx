import { Stack, Badge } from "@chakra-ui/react";
import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import {useTranslation} from "react-i18next";
import { Sprite, UserAvatar } from "../UI";
import { useState, useCallback } from "react";
import UserData from "../../models/auth/user-data";
const API_KEY = "AIzaSyDWa2O7ZtHX-7R3FGwn_KEAcHe_vW97gBI";
const bessengue = {latitude: 4.055561, longitude: 9.7067124};

interface MapProps {
    drivers: Array<UserData>;
    centerLocation?: {
        latitude: number;
        longitude: number;
    }
}
function formatLocation(obj: { latitude: number; longitude: number }) {
    return { lat: obj.latitude, lng: obj.longitude };
}

function markerStyle(active?: boolean) {
    let color = "#003592";
    if (active) {
        color = "green";
    }
    return { background: color, borderColor: color };
}

function DriverMarker(props: UserData) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoShown, setInfoShown] = useState(false);
    const handleClick = useCallback(() => setInfoShown((shown) => !shown), []);
    const closeInfo = useCallback(() => setInfoShown(false), []);
    const {t} = useTranslation();

    return (
        props.position
            ? <AdvancedMarker ref={markerRef} position={formatLocation(props.position)} onClick={handleClick}>
                <Pin {...markerStyle(props.available)} children={
                    <Sprite name="scooter" title="an illustration of a scooter" />
                } glyphColor="#fff" />

                {
                    infoShown && (
                        <InfoWindow anchor={marker} onClose={closeInfo} headerContent={t("delivery.driver_details")}>
                            <Stack gap={3} alignItems={"start"}>
                                <UserAvatar {...props} />
                                {
                                    props.internal
                                    ? <Badge p={".25em"}  colorScheme={"whatsapp"}>{t("delivery.internal")}</Badge>
                                    : <></>
                                }
                                <p>{t("users.status")}: <strong>{props.available ? t("available"): t("busy")}</strong></p>
                                <p>{t("users.gender")}: <strong>{props.gender === "M" ? t("users.male"): t("users.female")}</strong></p>
                            </Stack>
                        </InfoWindow>
                    )
                }
            </AdvancedMarker>
            : <></>
    );
}

function GoogleMap(props: MapProps) {

    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                mapId="ichantier"
                defaultCenter={formatLocation(props.centerLocation ?? bessengue)}
                defaultZoom={15}
            >
                {props.drivers.map(
                    (driver, index) => (
                        <DriverMarker key={index}{...driver} />
                    ))}
            </Map>
        </APIProvider>
    );
}

export default GoogleMap;
