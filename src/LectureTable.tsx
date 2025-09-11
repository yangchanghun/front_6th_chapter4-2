// LectureTable.tsx
import { Box, Button, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { memo, useEffect, useRef } from "react";
import { Lecture } from "./types";

type LectureTableProps = {
  lectures: Lecture[];
  onAdd: (lecture: Lecture) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  resetSignal?: number;
};

const LectureRow = memo(function LectureRow({
  lecture,
  onAdd,
}: {
  lecture: Lecture;
  onAdd: (lecture: Lecture) => void;
}) {
  return (
    <Tr>
      <Td width="100px">{lecture.id}</Td>
      <Td width="50px">{lecture.grade}</Td>
      <Td width="200px">{lecture.title}</Td>
      <Td width="50px">{lecture.credits}</Td>
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
      <Td
        width="150px"
        dangerouslySetInnerHTML={{ __html: lecture.schedule }}
      />
      <Td width="80px">
        <Button size="sm" colorScheme="green" onClick={() => onAdd(lecture)}>
          추가
        </Button>
      </Td>
    </Tr>
  );
});

export default function LectureTable({
  lectures,
  onAdd,
  onLoadMore,
  hasMore = true,
  resetSignal,
}: LectureTableProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapperRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || !onLoadMore || !hasMore) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { root, threshold: 0 }
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, [onLoadMore, hasMore]);

  useEffect(() => {
    if (resetSignal !== undefined) {
      wrapperRef.current?.scrollTo({ top: 0 });
    }
  }, [resetSignal]);

  return (
    <Box overflowY="auto" maxH="500px" ref={wrapperRef}>
      <Table size="sm" variant="striped">
        <Tbody>
          {lectures.map((lecture) => (
            <LectureRow key={lecture.id} lecture={lecture} onAdd={onAdd} />
          ))}
        </Tbody>
      </Table>
      <Box ref={sentinelRef} h="20px" />
    </Box>
  );
}
