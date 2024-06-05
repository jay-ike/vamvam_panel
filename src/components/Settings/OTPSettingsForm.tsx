import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSettingsData } from "../../api/admin/http";
import { LoadingButton } from "../UI";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const OTPSettingsForm: FC<{ ttl: number }> = ({ ttl }) => {
  const [enteredttl, setEnteredttl] = useState(ttl);
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({
    mutationFn: updateSettingsData,
    onSuccess: async () => {
      toast.success(t("settings.otp_update_success"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleChanged(event: ChangeEvent<HTMLInputElement>) {
    setEnteredttl(+event.target.value);
  }

  function handleSubmit(event: FormEvent) {
    const form = event.target as HTMLFormElement;
    event.preventDefault();
    if (form.checkValidity()) {
      mutate({ ttl: enteredttl });
    } else {
      form.reportValidity();
    }
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.600"
      borderRadius="md"
      p="6"
      mb="4"
      alignContent="center"
    >
      <form onSubmit={handleSubmit}>
        <Flex align="center" direction="column">
          <FormControl id="ttl">
            <FormLabel>
              TTL
              <Text as="i" fontSize="sm">
                {" "}
                ({t("settings.delay_for_otp")})
              </Text>
            </FormLabel>
            <Input
              type="number"
              min={1}
              placeholder={t("settings.enter_ttl")}
              borderColor="gray.500"
              value={enteredttl === 0 ? "" : enteredttl}
              onChange={handleChanged}
              required
            />
          </FormControl>
          <LoadingButton
            type="submit"
            mt="4"
            colorScheme="blue"
            loading={isPending}
            title={t("settings.update_otp")}
          />
        </Flex>
      </form>
    </Box>
  );
};

export default OTPSettingsForm;
