import React, { useState, useEffect } from "react";
import { Flex, Box, useMediaQuery, VStack } from "@chakra-ui/react";

import MsgDetail from "../../components/message/MsgDetail";
import { useQuery } from "react-query";
import { getLetterlists, getLetters } from "api/axios/axiosSetting";
import { useParams } from "react-router-dom";
import { ChatId, LetterList } from "interface/Interface";
import SendMsgBar from "components/message/SendMsgBar";

export default function MsgRoom() {
  //url params 가져오기
  const { chatId: chatIdString } = useParams<{ chatId: string }>();
  const chatId = chatIdString ? parseInt(chatIdString) : undefined;

  // 쪽지 내역 불러오기
  const { data, refetch } = useQuery<ChatId[]>(
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
        console.log("receiverPk:", targetReceiver.receiver_pk);
      }
    }
  }, [resultPk.data, chatId]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <Box
        bgColor={"white"}
        overflowX="hidden"
        h={isMobile === true ? "90vh" : "80vh"}
        w={isLargerThan768 ? "45vw" : "100vw"}
        maxW="100%"
      >
        {/* 주고받은 쪽지내역 */}
        {data?.map((item: ChatId, idx: number) => {
          return (
            <Flex
              key={idx}
              mt={5}
              justifyContent={item.is_sender ? "flex-end" : "flex-start"}
              alignItems={"center"}
              px={5}
            >
              <MsgDetail
                {...item}
                textId={id}
                refetch={refetch}
                chatId={chatId}
              />
            </Flex>
          );
        })}
        {receiverPk && <SendMsgBar receiver={receiverPk} refetch={refetch} />}
      </Box>
    </>
  );
}
