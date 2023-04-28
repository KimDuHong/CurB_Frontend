import React, { useState, useEffect } from "react";
import { Flex, Box, useMediaQuery } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import MsgDetail from "../../components/message/MsgDetail";
import { useQuery } from "react-query";
import { getLetterlists, getLetters } from "api/axios/axiosSetting";
import { useParams } from "react-router-dom";
import { ChatId, LetterList } from "interface/Interface";
import { useSendMsg } from "components/message/hook/useSendMsg";
import SendMsgBar from "components/message/SendMsgBar";
import SendMsg from "components/message/SendMsg";

export default function MsgRoom() {
  //url params 가져오기
  const { chatId: chatIdString } = useParams<{ chatId: string }>();
  const chatId = chatIdString ? parseInt(chatIdString) : undefined;

  // 쪽지 내역 불러오기
  const { data } = useQuery<ChatId[]>(
    ["letters", chatId],
    () => {
      if (chatId === undefined) {
        throw new Error("Invalid chatId");
      }
      return getLetters(chatId);
    },
    { enabled: chatId !== undefined }
  );

  //삭제 id 상태 관리
  const [id, setId] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (data) {
      const target = data.find((item) => item.textId);
      if (target) {
        setId(target.textId);
      }
    }
  }, [data]);

  // receiver_pk 불러오기

  const resultPk = useQuery<LetterList[]>("Letterlists", getLetterlists);
  const [receiverPk, setReceiverPk] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (resultPk.data) {
      const targetReceiver = resultPk.data.find(
        (chat: LetterList) => chat.pk === chatId
      );
      if (targetReceiver) {
        setReceiverPk(targetReceiver.receiver_pk);
      }
    }
  }, [resultPk.data, chatId]);

  const isMobile = useMediaQuery("(max-width: 769px)");

  return (
    <>
      <Box
        bgColor={"white"}
        overflowX="hidden"
        h="86vh"
        w={isMobile ? "100vmin" : "80vw"}
        mt={isMobile ? "0" : "20rem"}
        maxW="100%"
      >
        {/* 주고받은 쪽지내역 */}
        {data?.map((item: ChatId, idx: number) => {
          return (
            <Flex
              key={idx}
              mb={10}
              mt={5}
              justifyContent={item.is_sender ? "flex-end" : "flex-start"}
              alignItems={"center"}
              px={5}
            >
              <MsgDetail {...item} textId={id} />
            </Flex>
          );
        })}
        {receiverPk && <SendMsgBar receiver={receiverPk} />}
      </Box>
    </>
  );
}
