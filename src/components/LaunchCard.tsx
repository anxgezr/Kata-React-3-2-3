import { Button, Card, Text } from '@mantine/core';
import type { Launch } from '../types/launch';

interface LaunchCardProps {
  launch: Launch;
  onSelect: (launch: Launch) => void;
}

export default function LaunchCard({
  launch,
  onSelect,
}: LaunchCardProps) {
  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      className="launch-card"
    >
      <div className="launch-card__image">
        {launch.links?.mission_patch_small ? (
          <img
            src={launch.links.mission_patch_small}
            alt={`${launch.mission_name} mission patch`}
          />
        ) : (
          <div className="image-placeholder">
            No image
          </div>
        )}
      </div>

      <Text className="launch-card__name">
        {launch.mission_name}
      </Text>

      <Text className="launch-card__rocket">
        {launch.rocket?.rocket_name || 'Unknown rocket'}
      </Text>

      <Button
  fullWidth
  onClick={() => onSelect(launch)}
>
  Посмотреть больше
</Button>
    </Card>
  );
}
