import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSettingsData } from "../../api/admin/http";
import { LoadingButton } from "../UI";
import { DeliverySettingsValue, TypeItem } from "../../models/admin/settings";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import MultiTypesInputForm from "./MultiTypesInputForm";
import { useTranslation } from "react-i18next";

const DeliverySettingsForm: FC<DeliverySettingsValue> = (props) => {
  const { t } = useTranslation();
  const [ttl, setTtl] = useState(props.ttl);
  const [searchRadius, setSearchRadius] = useState(props.search_radius);
  const [conflicttypes, setConflicttypes] = useState<TypeItem[]>(
    props.conflict_types
  );
  const [packageTypes, setPackageTypes] = useState<TypeItem[]>(
    props.package_types
  );

  function handleTtlChange(event: ChangeEvent<HTMLInputElement>) {
    setTtl(+event.target.value);
  }

  function handleSearchRadiusChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchRadius(+event.target.value);
  }

  function handleConflictTypesChange(updatedItem: TypeItem, index: number) {
    const updatedConflictTypes = [...conflicttypes];
    updatedConflictTypes[index] = updatedItem;
    setConflicttypes(updatedConflictTypes);
  }

  function handlePackageTypesChange(updatedItem: TypeItem, index: number) {
    const updatedPackageTypes = [...packageTypes];
    updatedPackageTypes[index] = updatedItem;
    setPackageTypes(updatedPackageTypes);
  }

  function handleAddConflictTypes(newConflict: TypeItem) {
    setConflicttypes((prev) => [...prev, newConflict]);
  }

  function handleAddPackageTypes(newPackage: TypeItem) {
    setPackageTypes((prev) => [...prev, newPackage]);
  }

  function handleDeleteConflictTypes(index: number) {
    const updatedConflictTypes = [...conflicttypes];
    updatedConflictTypes.splice(index, 1);
    setConflicttypes(updatedConflictTypes);
  }

  function handleDeletePackageTypes(index: number) {
    const updatedPackageTypes = [...packageTypes];
    updatedPackageTypes.splice(index, 1);
    setPackageTypes(updatedPackageTypes);
  }

  function handleSubmit(event: FormEvent) {
    const form = event.target as HTMLFormElement;
    event.preventDefault();
    if (form.checkValidity()) {
      const data = {
        ttl: ttl,
        search_radius: searchRadius,
        conflict_types: conflicttypes,
        package_types: packageTypes,
      };
      mutate(data);
    } else {
      form.reportValidity();
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateSettingsData,
    onSuccess: async () => {
      toast.success(t("settings.delivery_update_success"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Box
      w={{ md: "70%", base: "100%" }}
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.600"
      p="6"
      mb="4"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing="8" justify="start">
          <Flex
            flexWrap={{ base: "wrap", lg: "nowrap" }}
            flexDirection={{ base: "column", lg: "row" }}
            justify="space-between"
            align="center"
          >
            <Box w={{ base: "100%", lg: "48%" }} mb={{ base: 4, lg: 0 }}>
              <FormControl id="ttl">
                <FormLabel>
                  TTL
                  <Text as="i" fontSize="sm">
                    {" "}
                    ({t("settings.delay_to_accept")})
                  </Text>
                </FormLabel>
                <Input
                  type="number"
                  min={1}
                  placeholder={t("settings.enter_ttl_seconds")}
                  borderColor="gray.500"
                  value={ttl === 0 ? "" : ttl}
                  onChange={handleTtlChange}
                  required
                />
              </FormControl>
            </Box>
            <Box w={{ base: "100%", lg: "48%" }}>
              <FormControl id="searchRadius">
                <FormLabel>
                  {t("settings.search_radius")}
                  <Text as="i" fontSize="sm">
                    {" "}
                    ({t("settings.search_radius_info")})
                  </Text>
                </FormLabel>
                <Input
                  type="number"
                  min={1}
                  placeholder={t("settings.enter_search_radius")}
                  borderColor="gray.500"
                  value={searchRadius === 0 ? "" : searchRadius}
                  onChange={handleSearchRadiusChange}
                  required
                />
              </FormControl>
            </Box>
          </Flex>
          <MultiTypesInputForm
            title={t("settings.conflict_types")}
            type={t("settings.conflict_type")}
            code="level"
            items={conflicttypes}
            onAddItem={handleAddConflictTypes}
            onChangeItem={handleConflictTypesChange}
            onDeleteItem={handleDeleteConflictTypes}
          />
          <MultiTypesInputForm
            title={t("settings.package_types")}
            type={t("settings.package_type")}
            code="type"
            items={packageTypes}
            onAddItem={handleAddPackageTypes}
            onChangeItem={handlePackageTypesChange}
            onDeleteItem={handleDeletePackageTypes}
          />
          <LoadingButton
            type="submit"
            size="md"
            colorScheme="blue"
            mt="4"
            loading={isPending}
            title={t("settings.update_delivery")}
          />
        </Stack>
      </form>
    </Box>
  );
};

export default DeliverySettingsForm;
