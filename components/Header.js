'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Group,
  Button,
  Text,
  Menu,
  Avatar,
  Burger,
  useMantineTheme,
  useMantineColorScheme,
  ActionIcon,
  Box,
  Container,
  Modal,
  Stack,
  TextInput,
  Select,
  Textarea,
  Grid,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useNotifications } from '@mantine/notifications'
import { DateTimePicker } from '@mantine/dates'
import {
  IconSun,
  IconMoon,
  IconUser,
  IconSettings,
  IconLogout,
  IconCalendar,
  IconHome,
} from '@tabler/icons-react'

export function Header({ user, setUser }) {
  const theme = useMantineTheme()
  const router = useRouter()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [opened, { toggle }] = useDisclosure()
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
  const notifications = useNotifications()

  const form = useForm({
    initialValues: {
      therapistId: '',
      date: '',
      time: '',
      type: '',
      notes: '',
      problem: '',
      duration: '',
    },
    validate: {
      therapistId: (value) => (!value ? 'Fizyoterapist seçin' : null),
      date: (value) => (!value ? 'Tarih seçin' : null),
      time: (value) => (!value ? 'Saat seçin' : null),
      type: (value) => (!value ? 'Tedavi türü seçin' : null),
      problem: (value) => (!value ? 'Şikayetinizi belirtin' : null),
    },
  })

  const therapists = [
    { id: 2, name: 'Dr. Ayşe Kaya' },
    { id: 3, name: 'Dr. Mehmet Demir' },
    { id: 4, name: 'Dr. Fatma Özkan' }
  ]

  const handleSubmit = async (values) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      notifications.show({
        title: 'Başarılı',
        message: 'Randevunuz başarıyla oluşturuldu!',
        color: 'green',
      })
      
      closeModal()
      form.reset()
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Randevu oluşturulamadı',
        color: 'red',
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return (
    <Box component="header" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Container size="lg">
        <Group h={70} px="md" justify="space-between">
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <Text size="lg" fw={700} c="black">
            VeriProje
          </Text>
        </Group>

        <Group visibleFrom="sm">
          <Button
            variant="subtle"
            leftSection={<IconHome size={16} />}
            component={Link}
            href="/"
            c="black"
          >
            Ana Sayfa
          </Button>
          <Button
            variant="subtle"
            component={Link}
            href="/services"
            c="black"
          >
            Hizmetler
          </Button>
          <Button
            variant="subtle"
            component={Link}
            href="/contact"
            c="black"
          >
            İletişim
          </Button>
                {user && (
                  <>
                    <Button
                      variant="subtle"
                      leftSection={<IconCalendar size={16} />}
                      component={Link}
                      href="/appointments"
                      c="black"
                    >
                      Randevular
                    </Button>
                    <Button
                      variant="subtle"
                      component={Link}
                      href="/dashboard"
                      c="black"
                    >
                      Dashboard
                    </Button>
                  </>
                )}
              </Group>

              <Group>
                <ActionIcon
                  variant="subtle"
                  onClick={toggleColorScheme}
                  size="lg"
                  aria-label="Toggle color scheme"
                >
                  {colorScheme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
                </ActionIcon>
              </Group>
        </Group>
      </Container>
      
      <Modal
        opened={modalOpened}
        onClose={() => {
          closeModal()
          form.reset()
        }}
        title="Fizyoterapi Randevusu Al"
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Select
              label="Fizyoterapist"
              placeholder="Fizyoterapist seçin"
              data={therapists.map(t => ({ value: String(t.id), label: t.name }))}
              required
              {...form.getInputProps('therapistId')}
            />

            <TextInput
              label="Şikayetiniz"
              placeholder="Hangi şikayetle geldiğinizi belirtin (örn: bel ağrısı, boyun ağrısı)"
              required
              {...form.getInputProps('problem')}
            />

            <Grid>
              <Grid.Col span={6}>
                <DateTimePicker
                  label="Tarih"
                  placeholder="Tarih seçin"
                  required
                  {...form.getInputProps('date')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DateTimePicker
                  label="Saat"
                  placeholder="Saat seçin"
                  type="time"
                  required
                  {...form.getInputProps('time')}
                />
              </Grid.Col>
            </Grid>

            <Select
              label="Tedavi Türü"
              placeholder="Tedavi türü seçin"
              data={[
                { value: 'manual_therapy', label: 'Manuel Terapi' },
                { value: 'exercise_therapy', label: 'Egzersiz Terapisi' },
                { value: 'electrotherapy', label: 'Elektroterapi' },
                { value: 'hydrotherapy', label: 'Hidroterapi' },
                { value: 'massage', label: 'Masaj' },
                { value: 'rehabilitation', label: 'Rehabilitasyon' },
                { value: 'sports_physio', label: 'Spor Fizyoterapisi' },
              ]}
              required
              {...form.getInputProps('type')}
            />

            <Select
              label="Süre"
              placeholder="Tedavi süresini seçin"
              data={[
                { value: '30', label: '30 dakika' },
                { value: '45', label: '45 dakika' },
                { value: '60', label: '60 dakika' },
                { value: '90', label: '90 dakika' },
              ]}
              {...form.getInputProps('duration')}
            />

            <Textarea
              label="Ek Notlar"
              placeholder="Ek bilgiler, özel durumlar, alerjiler vb..."
              {...form.getInputProps('notes')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={closeModal}>
                İptal
              </Button>
              <Button type="submit" size="lg" style={{ fontWeight: 700 }}>
                Randevu Al
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  )
}
