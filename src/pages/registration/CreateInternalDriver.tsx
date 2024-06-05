import { FormEvent, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { LoadingButton, PasswordField } from "../../components/UI";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import UploadFileBox from "../../components/registrations/UploadFileBox";
import {
  createInternalDriver,
  // createRegistration,
} from "../../api/registration/http";

function CreateInternalDriverPage() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File>();

  const { mutate, isPending } = useMutation({
    mutationFn: createInternalDriver,
    onSuccess: async () => {
      toast.success(t("registrations.driver_created_success"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(event: FormEvent) {
    const form = event.target as HTMLFormElement;
    event.preventDefault();
    if (form.checkValidity()) {
      const data = form.elements as any;
      const password = data.password.value;
      const cpassword = data.cpassword.value;

      if (password !== cpassword) {
        toast.error(t("auth.password_should_match"));
        return;
      }

      if (!file) {
        toast.error(t("registrations.bike_infos_required"));
        return;
      }

      mutate({
        email: data.email.value,
        phoneNumber: data.phoneNumber.value,
        password,
        age: data.age.value,
        firstName: data.firstName.value,
        lastName: data.lastName.value,
        gender: data.gender.value,
        carInfos: file,
        sponsorCode: data.sponsorCode.value,
      });
    } else {
      form.reportValidity();
    }
  }
  // const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={2} maxWidth={{ base: "100%", md: "700px" }} margin="auto">
      <Heading size="xl" mb={8} textAlign="center">
        {t("registrations.create_internal_driver")}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={8}>
          <HStack spacing={8} w="full" align="space-between">
            <FormControl isRequired>
              <FormLabel>{t("users.first_name")}</FormLabel>
              <Input type="text" name="firstName" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel> {t("users.last_name")}</FormLabel>
              <Input type="text" name="lastName" />
            </FormControl>
          </HStack>
          <HStack spacing={8} w="full" align="space-between">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel> {t("users.phone")}</FormLabel>
              <Input type="tel" name="phoneNumber" />
            </FormControl>
          </HStack>
          <HStack spacing={8} w="full" align="space-between">
            <FormControl isRequired>
              <FormLabel> {t("users.age_range")}</FormLabel>
              <Select name="age">
                {["18-24", "25-34", "35-44", "45-54", "55-64", "64+"].map(
                  (age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel> {t("users.gender")}</FormLabel>
              <Select name="gender">
                <option value="M">{t("users.male")}</option>
                <option value="F">{t("users.female")}</option>
              </Select>
            </FormControl>
          </HStack>
          <HStack spacing={8} w="full" align="space-between">
            <PasswordField name="password" label={t("auth.password")} />
            <PasswordField
              name="cpassword"
              label={t("auth.confirm_password")}
            />
          </HStack>
          <HStack spacing={8} w="full" align="space-between">
            <FormControl>
              <FormLabel> {t("registrations.sponsor_code")}</FormLabel>
              <Input mr={8} type="text" name="sponsorCode" />
            </FormControl>
            <FormControl>
              <FormLabel> {t("registrations.bike_infos")}</FormLabel>
              <UploadFileBox file={file} onSetFile={setFile} />
            </FormControl>
          </HStack>

          <LoadingButton
            type="submit"
            mt="4"
            w="full"
            alignSelf="center"
            colorScheme="blue"
            loading={isPending}
            title={t("registrations.create_driver")}
          />
        </VStack>
      </form>
    </Box>
  );
}

export default CreateInternalDriverPage;
