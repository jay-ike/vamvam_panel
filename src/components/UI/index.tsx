import { DatePicker as AntDatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Logo } from "./Logo.tsx";
import CircularLoader from "./CircularLoader.tsx";
import DarkModeSwitcher from "./DarkModeSwitcher.tsx";
import DropdownNotification from "./DropdownNotification.tsx";
import DropdownUser from "./DropdownUser.tsx";
import Layout from "./Layout.tsx";
import LinearLoader from "./LinearLoader.tsx";
import { PasswordField } from "./PasswordField.tsx";
import SidebarLinkGroup from "./Sidebar/SidebarLinkGroup.tsx";
import Sidebar from "./Sidebar/Sidebar.tsx";
import LoadingButton from "./LoadingButton.tsx";
import LangSwitcher from "./LangSwitcher.tsx";
import GoogleMap from "./GMap.tsx";
import OverviewTableTyped, { Sprite, OptionSelector, Ratings, Location, UserAvatar } from "./OverviewTableTyped.tsx";

type Props = {
    from?: string,
    to?: string,
    onRangeChange: (from?: string, to?: string) => void
}

function DateRangePicker(props: Props) {
    const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
        dayjs(props.from ?? "").isValid() ? dayjs(props.from) : null,
        dayjs(props.to ?? "").isValid() ? dayjs(props.to) : null,
    ]);
    function handleRangeChange(dates: any, dateStrings: [string, string]) {
        const [from, to] = dateStrings.map((val) => (
            dayjs(val).isValid()
                ? dayjs(val).format("YYYY-MM-DD")
                : ""
        ));
        setRange(dates);
        props.onRangeChange(from, to);
    }
    return (
        <AntDatePicker.RangePicker value={range} onChange={handleRangeChange} />
    );
}
export {
    LoadingButton,
    CircularLoader,
    DarkModeSwitcher,
    DateRangePicker,
    DropdownNotification,
    DropdownUser,
    GoogleMap,
    Layout,
    LinearLoader,
    Location,
    Logo,
    OptionSelector,
    OverviewTableTyped,
    PasswordField,
    Sidebar,
    LangSwitcher,
    Ratings,
    SidebarLinkGroup,
    Sprite,
    UserAvatar
};
