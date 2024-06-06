import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    HStack,
    Heading,
    Stack,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { FC, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import sprite from "../../images/icons.svg";
import { PAGE_LIMIT, debouncer, fullName } from "../../helper";

type Props = {
    onPrevious?: VoidFunction;
    onNext?: VoidFunction;
    children?: React.ReactNode;
    headerTrailer?: React.ReactNode;
    currentPage: number;
    items: any[];
    title: string;
    pageSize?: number;
};

type OptionProps = {
    id: string;
    name: any;
}
type SpriteProps = {
    name: string;
    options?: any;
    size?: number;
    title?: string;
};


const OverviewTableTyped: FC<Props> = (props) => {
    const { t } = useTranslation();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const currentPage = props.currentPage;
    const totalItemLength = props.items.length;
    const pageSize = props.pageSize ?? PAGE_LIMIT;
    return (
        <Box
            bg="bg.surface"
            boxShadow={{ base: "sm", md: "md" }}
            borderRadius={{ base: "none", md: "lg" }}
        >
            <Stack spacing="5">
                <Box px={{ base: "4", md: "6" }} pt="5">
                    <Stack
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                    >
                        <Heading size="xl" textAlign="left">
                            {props.title}
                        </Heading>
                        {props.headerTrailer}
                    </Stack>
                </Box>
                <Box overflowX="auto" minH={"60lvb"} maxH={"80lvb"}>{props.children}</Box>
                <Box px={{ base: "4", md: "6" }} pb="5">
                    <HStack spacing="3" justify="space-between">
                        {!isMobile && totalItemLength > 0 && (
                            <Text color="fg.muted" textStyle="sm">
                                {t("showing")}{" "}
                                {currentPage <= 1
                                    ? currentPage
                                    : Math.min(
                                        (currentPage - 1) * pageSize,
                                        totalItemLength
                                    )}{" "}
                                {t("to")} {Math.min(currentPage * pageSize, totalItemLength)}{" "}
                                {t("of")} {totalItemLength} {t("result")}
                                {totalItemLength > 1 ? "s" : ""}
                            </Text>
                        )}
                        <ButtonGroup
                            spacing="3"
                            justifyContent="space-between"
                            width={{ base: "full", md: "auto" }}
                            variant="secondary"
                        >
                            {props.onPrevious && (
                                <Button onClick={props.onPrevious}>{t("previous")}</Button>
                            )}
                            {props.onNext && (
                                <Button onClick={props.onNext}>{t("next")}</Button>
                            )}
                        </ButtonGroup>
                    </HStack>
                </Box>
            </Stack>
        </Box>
    );
};

export function Sprite(props: SpriteProps) {
    const size = props.size ?? 24;
    return (
        <svg width={size} height={size} {...(props.options ?? {})}>
            <title>{props.title}</title>
            <use href={sprite + "#" + props.name} />
        </svg>
    );
}

function Option(props: OptionProps) {
    return (
        <div className="row f-option">
            <span className="no-shrink">
                <input type="checkbox" name={props.name} id={props.id} />
                <Sprite name="checked" options={{ "aria-hidden": true }} />
            </span>
            <label htmlFor={props.id}>{props.name}</label>
        </div>
    );
}

export function UserAvatar(props: any) {
    const name = fullName(props.firstName, props.lastName);
    return (
        <HStack spacing="3">
            <Avatar name={props.name ?? name} src={props.avatar} boxSize="10" />
            <Box>
                <Text fontWeight="medium" casing={"capitalize"}>{props.name ?? name}</Text>
                <Text fontSize={"sm"} color={"fg.muted"}>{props.phone}</Text>
            </Box>
        </HStack>
    );
}
export function Ratings(props: any) {
    return (
        <div className="row ratings">
            {
                Array(5).fill("").map(function(val, index) {
                    return (
                        <Sprite key={index} name="star" options={{ "data-theme": index < props.note ? "rating-bg" : "rating-fg" }} title={val + "star number " + (index + 1) + " " + (index < props.note ? "filled" : "empty")} />
                    );
                })
            }
        </div>
    );
}

export function Location(props: any) {
    return (
        props.address
            ? <Text>{props.address}</Text>
            : <Box>
                <Text fontSize={"sm"}>longitude: {props.longitude}</Text>
                <Text fontSize={"sm"}>latitude: {props.latitude}</Text>
            </Box>
    );
}


export function OptionSelector(
    props: {
        debounceSecond?: number,
        options: any,
        onChange: (val?: any) => void,
        title: string
    }
) {
    const debounce = debouncer(props.onChange, props.debounceSecond ?? 1);
    function handleChange(event: FormEvent) {
        let result: any;
        let form = event.currentTarget as HTMLFormElement;

        result = Array.from(form.elements).filter(
            (el) => (el as HTMLInputElement).checked === true
        ).map((el: any) => el?.name).join(",");
        debounce(result);
    }

    return (
        <details className="d-filter">
            <summary className="row" data-icon-suffix data-icon="arrow_down">{props.title}</summary>
            <Box
                as="form"
                bgColor={"white"}
                borderRadius={".5rem"}
                shadow={"sm"} p={4} className="column" onChange={handleChange}>
                {
                    Object.entries(props.options).map(
                        function([key, val]) {
                            return (
                                <Option key={key} id={key} name={val} />
                            );
                        }
                    )
                }
            </Box>
        </details>
    );
}

export default OverviewTableTyped;
