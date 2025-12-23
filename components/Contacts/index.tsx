import axiosInstance from "@/utils/axiosInstance";
import * as Contacts from "expo-contacts";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import styles from "../Chats/styles";

type ContactsType = {
  name: string;
  phone: string;
  phoneCode: string;
  _id: string;
  avatar: string;
  status: string;
}[];

function ContactsScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactsType | []>([]);

  async function syncContacts() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const formattedContacts = data
        .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
        .map((c) => {
          const rawNumber = c.phoneNumbers![0].number ?? "";

          const phoneCode = rawNumber.startsWith("+")
            ? rawNumber.slice(0, 3)
            : "+91";

          const phone = rawNumber.replace(/\D/g, "").slice(-10);

          return {
            name: c.name,
            phone,
            phoneCode,
          };
        })
        .filter((c) => c.phone.length === 10);

      const commonContacts = await axiosInstance.post("/contacts", {
        contacts: formattedContacts,
      });
      setContacts(commonContacts.data);
    } else {
      setContacts([]);
    }
  }

  useEffect(() => {
    syncContacts();
  }, []);

  const handleRedirect = (uuid: string) => {
    router.push({
      pathname: "/(protected)/chat/[uuid]",
      params: { uuid },
    });
  };
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.chatItem}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Pressable onPress={() => handleRedirect(item._id)}>
            <View style={styles.chatContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text numberOfLines={1} style={styles.lastMessage}>
                {item.status}
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    />
  );
}

export default ContactsScreen;
