import React, { FormEvent, useState } from "react";
import { Flex, HStack, Input, Select } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { updateBonus } from "../../api/admin/http";
import { useMutation } from "@tanstack/react-query";
import { LoadingButton } from "../UI";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { userActions } from "../../store/users/user-slice";

type Props = {
  onClose: VoidFunction;
  userId: string;
};

const BonusControl: React.FC<Props> = ({ onClose, userId }) => {
  const [points, setPoints] = useState<number>(0);
  const [action, setAction] = useState<"add" | "remove">("add");
  const isAdding = action === "add";
  const dispatch = useDispatch<AppDispatch>();

  const { mutate, isPending } = useMutation({
    mutationFn: updateBonus,
    onSuccess: () => {
      toast.success(
        isAdding ? "Bonus added successfully" : "Bonus removed successfully"
      );
      dispatch(
        userActions.changeUserBonus({
          id: userId,
          bonus: points * (action === "add" ? 1 : -1),
        })
      );
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
      onClose();
    },
  });

  function handleSubmit(event: FormEvent) {
    const form = event.target as HTMLFormElement;
    event.preventDefault();
    if (form.checkValidity()) {
      const data = (form.elements as any).points.value;
      mutate({
        bonus: data,
        type: isAdding ? "recharge" : "withdrawal",
        driverId: userId,
      });
    } else {
      form.reportValidity();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex alignItems="start" justifyContent="center" flexDirection="column">
        <HStack spacing={4} mb={4}>
          <Input
            placeholder="Enter points"
            name="points"
            type="number"
            min={1}
            required
            value={points === 0 ? "" : points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
          <Select
            onChange={(event) =>
              setAction(event.target.value as "add" | "remove")
            }
          >
            <option value="add">Add bonus</option>
            <option value="remove">Remove bonus</option>
          </Select>
        </HStack>

        <LoadingButton
          loading={isPending}
          title="Update Points"
          type="submit"
          colorScheme="blue"
        />
      </Flex>
    </form>
  );
};

export default BonusControl;
