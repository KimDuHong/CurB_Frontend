import React, { useState } from "react";
import {
  Stack,
  Text,
  Box,
  Avatar,
  HStack,
  useDisclosure,
  Button,
  Badge,
  Flex,
  VStack,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faScissors } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "react-query";
import { deleteLetters } from "api/axios/axiosSetting";
import { ChatId } from "interface/Interface";

interface MsgDetailProps {
  textId?: number;
  text: string;
  is_sender: boolean;
}

const MsgDetail = ({ text, is_sender, textId }: MsgDetailProps) => {
  //마우스 hover 상태 관리
  const [isHovering, setIsHovering] = useState(true);
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  //삭제 모달 관리
  const { isOpen, onOpen, onClose } = useDisclosure();

  const queryClient = useQueryClient();
  const deleteMutation = useMutation(deleteLetters, {
    onSuccess: () => {
      queryClient.invalidateQueries("text");
      onClose();
    },
    onError: (error) => {
      console.error("에러!!", error);
      onClose();
    },
  });

  return (
    <Flex>
      {/* 쪽지 내역 */}
      <Box
        padding="6"
        boxShadow="xl"
        bgColor={is_sender ? "#F7FE2E" : "white"}
        w={"13rem"}
        h={"10rem"}
        cursor={"pointer"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Stack spacing={2}>
          <HStack>
            <FontAwesomeIcon icon={faPaperclip} />
          </HStack>
          <HStack>
            <Avatar size="xs" />

            <Text fontWeight={600} color={is_sender ? "blue" : "red"}>
              {is_sender ? "To. " : "From. "}
            </Text>
          </HStack>
          <HStack>
            {isHovering && (
              <button onClick={onOpen}>
                <FontAwesomeIcon icon={faScissors} />
              </button>
            )}
            <Text as="ins">{text}</Text>
          </HStack>
        </Stack>
      </Box>

      {/* 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>쪽지를 삭제하시겠습니까?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            삭제한 쪽지는 개인 쪽지함에서만 삭제되고, 상대 쪽지함에서는 삭제되지
            않습니다.{" "}
          </ModalBody>

          <ModalFooter>
            {textId && (
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => {
                  if (textId) {
                    deleteMutation.mutate(textId);
                  }
                }}
              >
                Delete
              </Button>
            )}

            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MsgDetail;
