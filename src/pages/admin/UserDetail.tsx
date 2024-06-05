import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
} from "@chakra-ui/react";
import { FC } from "react";
import UserData from "../../models/auth/user-data";
import { getFilePath, toCapitalize } from "../../helper/utils";
import { useMutation } from "@tanstack/react-query";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { activateUser, blockUser } from "../../api/admin/http";
import { LoadingButton } from "../../components/UI";
import { userActions } from "../../store/users/user-slice";
import BonusControl from "../../components/Users/BonusControl";
import { useTranslation } from "react-i18next";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  user: UserData;
};

const UserDetailPage: FC<Props> = ({ isOpen, onClose, user }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const isActive = user.status === "active";

  const { mutate, isPending } = useMutation({
    mutationFn: isActive ? blockUser : activateUser,
    onSuccess: handleOnSuccess,
    onError: handleOnError,
  });

  function handleOnError(error: Error) {
    toast.error(error.message);
    onClose();
  }

  function handleOnSuccess() {
    dispatch(
      userActions.changeUserStatus({
        id: user.id,
        status: isActive ? "deactivated" : "active",
      })
    );
    toast.success(
      isActive ? "User deactivated successfully" : "User activated successfully"
    );
    onClose();
  }

  function handleUpdateStatus() {
    mutate(user.id);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{t("users.user_details")}</ModalHeader>
          <ModalBody p={8}>
            <VStack spacing={8} align="start">
              <Avatar src={getFilePath(user.avatar as string)} boxSize="32" />
              <HStack w="full" justify="space-between" align="start">
                <VStack align="start">
                  <HStack>
                    <Text fontSize="sm" as="b">
                      {t("users.first_name")}
                    </Text>
                    <Text>{toCapitalize(user.firstName ?? "--")}</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm" as="b">
                      {t("users.phone")}:
                    </Text>
                    <Text>{user.phone ?? "--"}</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm" as="b">
                      {t("users.gender")}:
                    </Text>
                    <Text>{user.gender ?? "--"}</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm" as="b">
                      {t("users.role")}:
                    </Text>
                    <Text>{toCapitalize(user.role ?? "--")}</Text>
                  </HStack>
                  {user.role === "driver" && <HStack>
                    <Text fontSize="sm" as="b">
                      Points:
                    </Text>
                    <Text>{user.point}</Text>
                  </HStack>}
                </VStack>
                <VStack align="start">
                  <HStack>
                    <Text fontSize="sm" as="b">
                      {t("users.last_name")}:
                    </Text>
                    <Text>{toCapitalize(user.lastName ?? "--")}</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm" as="b">
                      Email :
                    </Text>
                    <Text>{user.email ?? "--"}</Text>
                  </HStack>{" "}
                  <HStack>
                    <Text fontSize="sm" as="b">
                      {t("users.age_range")} :
                    </Text>
                    <Text>{user.age ?? "--"}</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <HStack>
                      <Text fontSize="sm" as="b">
                        {t("users.status")} :
                      </Text>
                      <Badge
                        size="sm"
                        colorScheme={user.status === "active" ? "green" : "red"}
                      >
                        {user.status}
                      </Badge>
                    </HStack>
                  </HStack>
                  {user.role === "driver" &&  <HStack>
                    <Text fontSize="sm" as="b">
                      Bonus:
                    </Text>
                    <Text>{user.bonus}</Text>
                  </HStack>}
                </VStack>
              </HStack>
              {user.role === "driver" && (
                <VStack
                  align="start"
                  p={4}
                  borderRadius={4}
                  borderWidth="1px"
                  borderColor="gray.600"
                >
                  <Text as="b" mb={4}>
                    {t("users.add_or_remove_bonus")}
                  </Text>
                  <BonusControl onClose={onClose} userId={user.id} />
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray.600"
              variant="outline"
              mr={3}
              onClick={onClose}
            >
              {t("close")}
            </Button>
            <LoadingButton
              loading={isPending}
              title={isActive ? t("users.deactivate") : t("users.activate")}
              onClick={handleUpdateStatus}
              colorScheme={isActive ? "red" : "blue"}
            />
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default UserDetailPage;
