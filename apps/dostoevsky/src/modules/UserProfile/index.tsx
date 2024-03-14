import { Card, Modal, SocialLink } from "@glimmer/ui/web/components";
import { useGetUser } from "apps/dostoevsky/src/hooks/useGetUser";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type Props = {
	id: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export const UserProfile: React.FC<Props> = ({ open, setOpen, id }) => {
	const { data, isLoading } = useGetUser(id);

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			showCloseButton
			shouldCloseOnEsc
			shouldCloseOnOutsideClick
		>
			<Card className="w-[350px] py-[60px] p-10">
				{!data || isLoading ? (
					<h5>Loading...</h5>
				) : (
					<div className="flex flex-col justify-center items-center">
						<div className="flex flex-col items-center mb-3">
							<Image
								src={data.image}
								alt="user-img"
								width={50}
								height={50}
								className="rounded-full"
							/>
							<h5>{data.name}</h5>
						</div>
						<p className="text-center mb-8">{data.description}</p>
						<div className="flex items-center justify-center gap-5 flex-wrap">
							{data.links.map((link, idx) => (
								<SocialLink key={idx} {...link} />
							))}
						</div>
					</div>
				)}
			</Card>
		</Modal>
	);
};
