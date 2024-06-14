import { useElementOnView } from "apps/dostoevsky/src/hooks/useElementOnView";
import { useRooms } from "apps/dostoevsky/src/hooks/useRooms";
import { Room } from "apps/dostoevsky/src/modules/HomePage/Feed/Room";
import { InfiniteQueryLoader } from "@glimmer/ui/web";

export const Rooms = () => {
	const { rooms, isLoading, fetchNextPage, isFetchingNextPage } = useRooms();
	const [ref] = useElementOnView<HTMLDivElement>(() => fetchNextPage());

	return (
		<div>
			{isLoading ? (
				<h5>Loading...</h5>
			) : (
				<div className="flex flex-col gap-5">
					{rooms.map((room) => (
						<Room key={room.id} {...room} />
					))}
					<InfiniteQueryLoader ref={ref} isFetching={isFetchingNextPage} />
				</div>
			)}
		</div>
	);
};
