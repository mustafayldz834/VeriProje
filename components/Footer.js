'use client'

import Link from 'next/link'
import {
  Container,
  Grid,
  Text,
  Group,
  Stack,
  Title,
  Anchor,
  Divider,
  Box,
  ActionIcon,
} from '@mantine/core'
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconCalendar,
  IconUser,
  IconHeart,
  IconShield,
} from '@tabler/icons-react'

export function Footer() {
  return (
    <Box bg="#7a6b5f" c="white">
      <Container size="lg" py={60}>
        <Grid>
          {/* Company Info */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Title order={3} c="white" fw={700} size="1.5rem">
                VeriProje
              </Title>
              <Text size="md" c="gray.3" lh={1.6} fw={400}>
                Fiziksel sağlık ve iyilik halinizi geliştirmek için yıllardır özveriyle çalışıyoruz. 
                Postür, denge ve hareket fonksiyonlarınızı geliştirerek daha sağlıklı bir bedene kavuşmanızı sağlıyoruz.
              </Text>
              <Group gap="sm">
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <IconBrandFacebook size={20} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <IconBrandTwitter size={20} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <IconBrandInstagram size={20} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <IconBrandLinkedin size={20} />
                </ActionIcon>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Quick Links */}
          <Grid.Col span={{ base: 12, md: 2 }}>
            <Stack gap="md">
              <Title order={4} c="white" fw={600} size="1.1rem">
                Hızlı Linkler
              </Title>
              <Stack gap="xs">
                <Anchor component={Link} href="/" c="gray.3" size="md" fw={400}>
                  Ana Sayfa
                </Anchor>
                <Anchor component={Link} href="/services" c="gray.3" size="md" fw={400}>
                  Hizmetlerimiz
                </Anchor>
                <Anchor component={Link} href="/about" c="gray.3" size="md" fw={400}>
                  Hakkımızda
                </Anchor>
                <Anchor component={Link} href="/contact" c="gray.3" size="md" fw={400}>
                  İletişim
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Services */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Stack gap="md">
              <Title order={4} c="white" fw={600} size="1.1rem">
                Hizmetlerimiz
              </Title>
              <Stack gap="xs">
                <Text c="gray.3" size="md" fw={400}>
                  Bireysel Terapi
                </Text>
                <Text c="gray.3" size="md" fw={400}>
                  Aile Terapisi
                </Text>
                <Text c="gray.3" size="md" fw={400}>
                  Çift Terapisi
                </Text>
                <Text c="gray.3" size="md" fw={400}>
                  Grup Terapisi
                </Text>
                <Text c="gray.3" size="md" fw={400}>
                  Online Terapi
                </Text>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Contact Info */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Stack gap="md">
              <Title order={4} c="white" fw={600} size="1.1rem">
                İletişim Bilgileri
              </Title>
              <Stack gap="sm">
                <Group gap="sm">
                  <IconPhone size={18} color="#228be6" />
                  <Text c="gray.3" size="md" fw={400}>
                    +90 (212) 555-0123
                  </Text>
                </Group>
                <Group gap="sm">
                  <IconMail size={18} color="#228be6" />
                  <Text c="gray.3" size="md" fw={400}>
                    info@veriproje.com
                  </Text>
                </Group>
                <Group gap="sm">
                  <IconMapPin size={18} color="#228be6" />
                  <Text c="gray.3" size="md" fw={400}>
                    İstanbul, Türkiye
                  </Text>
                </Group>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="xl" color="gray.7" />

        {/* Bottom Section */}
        <Group justify="space-between" align="center">
          <Text c="gray.4" size="sm" fw={400}>
            © 2024 VeriProje. Tüm hakları saklıdır.
          </Text>
          <Group gap="md">
            <Anchor c="gray.4" size="sm" fw={400}>
              Gizlilik Politikası
            </Anchor>
            <Anchor c="gray.4" size="sm" fw={400}>
              Kullanım Şartları
            </Anchor>
            <Anchor c="gray.4" size="sm" fw={400}>
              Çerez Politikası
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  )
}
