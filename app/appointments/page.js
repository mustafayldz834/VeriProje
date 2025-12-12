'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from '@mantine/form'
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Button,
  Stack,
  Badge,
  Avatar,
  Table,
  Modal,
  TextInput,
  Select,
  Textarea,
  ActionIcon,
  Menu,
  Alert,
  LoadingOverlay,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconDots,
  IconCalendar,
  IconClock,
  IconUser,
  IconAlertCircle,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import { appointmentAPI, userAPI } from '../../services/api'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useLocalStorage } from '@mantine/hooks'
import { useSearchParams } from 'next/navigation'

export default function Appointments() {
  const [user, setUser] = useLocalStorage({ key: 'user', defaultValue: null })
  const router = useRouter()
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState([])
  const [therapists, setTherapists] = useState([])
  const [loading, setLoading] = useState(true)
  const [opened, { open, close }] = useDisclosure(false)
  const [editingAppointment, setEditingAppointment] = useState(null)

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

  useEffect(() => {
    if (searchParams?.get('modal') === '1') {
      open();
    }
    loadAppointments()
    loadTherapists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      // Eğer kullanıcı giriş yapmamışsa boş liste göster
      const userData = localStorage.getItem('user')
      if (!userData) {
        setAppointments([])
        return
      }
      const response = await appointmentAPI.getMyAppointments()
      setAppointments(response.data)
    } catch (error) {
      console.error('Appointments load error:', error)
      // Hata durumunda boş liste göster
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const loadTherapists = async () => {
    try {
      const response = await userAPI.getTherapists()
      setTherapists(response.data)
    } catch (error) {
      console.error('Therapists load error:', error)
      // Hata durumunda boş liste göster
      setTherapists([])
    }
  }

  const handleSubmit = async (values) => {
    try {
      // Tarih ve saat formatlaması
      let formattedDate = values.date
      if (values.date instanceof Date) {
        // Date objesi ise YYYY-MM-DD formatına çevir (SQL Server için)
        const year = values.date.getFullYear()
        const month = String(values.date.getMonth() + 1).padStart(2, '0')
        const day = String(values.date.getDate()).padStart(2, '0')
        formattedDate = `${year}-${month}-${day}`
      } else if (values.date && typeof values.date === 'string' && values.date.includes('/')) {
        // DD/MM/YYYY formatını YYYY-MM-DD'ye çevir
        const parts = values.date.split('/')
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
        }
      }
      
      // Tedavi türü kodunu TreatmentTypeID'ye çevir
      // Önce veritabanından tedavi türlerini al (mock data için mapping)
      const treatmentTypeMapping = {
        'manual_therapy': 1,
        'exercise_therapy': 2,
        'electrotherapy': 3,
        'hydrotherapy': 4,
        'massage': 5,
        'rehabilitation': 6,
        'sports_physio': 7
      }
      
      const treatmentTypeId = treatmentTypeMapping[values.type] || values.type
      
      const formattedValues = {
        therapistId: parseInt(values.therapistId) || values.therapistId,
        treatmentTypeId: treatmentTypeId,
        appointmentDate: formattedDate,
        appointmentTime: values.time || '',
        duration: parseInt(values.duration) || 60,
        problem: values.problem || null,
        notes: values.notes || null
      }

      if (editingAppointment) {
        // Update existing appointment
        await appointmentAPI.updateStatus(editingAppointment.id, formattedValues)
        notifications.show({
          title: 'Başarılı',
          message: 'Randevu güncellendi',
          color: 'green',
        })
      } else {
        // Create new appointment - kullanıcı bilgisi ekle
        const userData = localStorage.getItem('user')
        const user = userData ? JSON.parse(userData) : null
        
        // PatientID'yi al (patientId varsa onu kullan, yoksa user.id'yi kullan)
        const patientId = user?.patientId || user?.id || 1
        
        const appointmentData = {
          ...formattedValues,
          patientId: patientId
        }
        await appointmentAPI.create(appointmentData)
        notifications.show({
          title: 'Başarılı',
          message: 'Randevunuz başarıyla oluşturuldu!',
          color: 'green',
        })
      }
      close()
      form.reset()
      setEditingAppointment(null)
      loadAppointments()
    } catch (error) {
      console.error('Randevu oluşturma hatası:', error)
      notifications.show({
        title: 'Hata',
        message: error.response?.data?.message || error.message || 'İşlem başarısız',
        color: 'red',
      })
    }
  }

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment)
    // Tarih formatını düzelt (YYYY-MM-DD → Date objesi veya DD/MM/YYYY)
    let dateValue = appointment.date || ''
    if (dateValue && typeof dateValue === 'string' && dateValue.includes('-')) {
      // YYYY-MM-DD formatını Date objesine çevir
      dateValue = new Date(dateValue + 'T00:00:00')
    }
    
    form.setValues({
      therapistId: String(appointment.therapistId || ''),
      date: dateValue,
      time: appointment.time || appointment.appointmentTime || '',
      type: appointment.type || appointment.treatmentTypeCode || '',
      notes: appointment.notes || '',
      problem: appointment.problem || '',
      duration: appointment.duration || '',
    })
    open()
  }

  const handleDelete = async (appointmentId) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, { status: 'cancelled' })
      notifications.show({
        title: 'Başarılı',
        message: 'Randevu iptal edildi',
        color: 'green',
      })
      loadAppointments()
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Randevu iptal edilemedi',
        color: 'red',
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green'
      case 'pending': return 'yellow'
      case 'completed': return 'blue'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı'
      case 'pending': return 'Beklemede'
      case 'completed': return 'Tamamlandı'
      case 'cancelled': return 'İptal Edildi'
      default: return 'Bilinmiyor'
    }
  }

  const rows = appointments.map((appointment) => (
    <Table.Tr key={appointment.id}>
      <Table.Td>
        <Group>
          <Avatar size="sm" radius="xl">
            {appointment.therapist?.name?.split(' ').map(n => n[0]).join('') || 'F'}
          </Avatar>
          <div>
            <Text fw={500}>{appointment.therapist?.name || 'Fizyoterapist'}</Text>
            <Text size="sm" c="dimmed">{appointment.type}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{appointment.date}</Text>
        <Text size="xs" c="dimmed">{appointment.time}</Text>
        {appointment.duration && (
          <Text size="xs" c="dimmed">{appointment.duration} dk</Text>
        )}
      </Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(appointment.status)} size="sm">
          {getStatusText(appointment.status)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() => handleEdit(appointment)}
            >
              Düzenle
            </Menu.Item>
            {appointment.status !== 'cancelled' && (
              <Menu.Item
                leftSection={<IconX size={14} />}
                color="red"
                onClick={() => handleDelete(appointment.id)}
              >
                İptal Et
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Container size="xl" py={40}>
        <Stack>
          <Group justify="space-between">
            <div>
              <Title order={1} fw={900} c="black" style={{ textRendering: 'optimizeLegibility' }}>
                Fizyoterapi Randevusu Al
              </Title>
              <Text c="dimmed" size="lg" fw={700} style={{ textRendering: 'optimizeLegibility' }}>
                Uzman fizyoterapistlerimizle randevu alın ve sağlığınıza kavuşun
              </Text>
            </div>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={open}
              size="xl"
              style={{ fontWeight: 700 }}
            >
              Yeni Randevu Al
            </Button>
          </Group>

        <Card withBorder>
          <LoadingOverlay visible={loading} />
          {appointments.length === 0 ? (
            <Alert
              icon={<IconCalendar size={16} />}
              title="Randevu bulunamadı"
              color="blue"
            >
              Henüz fizyoterapi randevunuz bulunmuyor. Yeni bir randevu almak için yukarıdaki butonu kullanın.
            </Alert>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Fizyoterapist</Table.Th>
                  <Table.Th>Tarih & Saat</Table.Th>
                  <Table.Th>Durum</Table.Th>
                  <Table.Th>İşlemler</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          )}
        </Card>

        <Modal
          opened={opened}
          onClose={() => {
            close()
            form.reset()
            setEditingAppointment(null)
          }}
          title={editingAppointment ? 'Randevu Düzenle' : 'Fizyoterapi Randevusu Al'}
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
                  <TextInput
                    label="Saat"
                    placeholder="Saat seçin (örn: 14:30)"
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
                <Button variant="outline" onClick={close}>
                  İptal
                </Button>
                <Button type="submit" size="lg" style={{ fontWeight: 700 }}>
                  {editingAppointment ? 'Güncelle' : 'Randevu Al'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Container>
    <Footer />
    </>
  )
}
