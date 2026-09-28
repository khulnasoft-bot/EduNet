import { pgTable, uuid, text, timestamp, boolean, index, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users, courses, assignments } from '@edunet/database';

// Notifications - User notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // assignment_created, assignment_due, graded, enrollment, announcement
  title: text('title').notNull(),
  message: text('message').notNull(),
  metadata: text('metadata'), // JSON string for additional data
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at'),
  actionUrl: text('action_url'), // URL to navigate to when clicked
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notifications_user_id_idx').on(table.userId),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
  typeIdx: index('notifications_type_idx').on(table.type),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}));

// Notification Preferences - User notification settings
export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  emailEnabled: boolean('email_enabled').default(true).notNull(),
  pushEnabled: boolean('push_enabled').default(true).notNull(),
  assignmentReminders: boolean('assignment_reminders').default(true).notNull(),
  gradeNotifications: boolean('grade_notifications').default(true).notNull(),
  enrollmentNotifications: boolean('enrollment_notifications').default(true).notNull(),
  announcementNotifications: boolean('announcement_notifications').default(true).notNull(),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('notification_preferences_user_id_idx').on(table.userId),
}));

// Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id],
  }),
}));
