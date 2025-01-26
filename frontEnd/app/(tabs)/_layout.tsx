import { withLayoutContext } from "expo-router";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";

export const Tabs = withLayoutContext(
  createNativeBottomTabNavigator().Navigator
);

export default function TabLayout() {
  return (
    <Tabs
      tabBarStyle={{
        backgroundColor: 'black',
      }}
      tabLabelStyle={{
        fontSize: 12,
        fontWeight: "bold"
      }}
      rippleColor="transparent"
      labeled={true}
      hapticFeedbackEnabled={true}
      activeIndicatorColor="transparent"
      tabBarActiveTintColor='#fff'
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
          tabBarIcon: () => require('../../assets/images/event-icon.png')
        }}
      />
      <Tabs.Screen
        name="vote"
        options={{
          title: 'Vote',
          tabBarIcon: () =>  require('../../assets/images/vote-icon.png'),
        }}
        />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: () =>  require('../../assets/images/compass-icon.png'),
        }}
      />
    </Tabs>
  );
}
