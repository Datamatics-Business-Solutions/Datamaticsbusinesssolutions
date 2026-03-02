import { motion } from 'motion/react';
import { Calendar, TrendingUp, Clock, CheckCircle2, Package } from 'lucide-react';
import { format, parseISO, isAfter, isBefore, startOfWeek, endOfWeek, isSameDay, addDays, differenceInDays } from 'date-fns';
import type { Campaign } from '../data/mockClients';

interface DeliveryScheduleSectionProps {
  campaign: Campaign;
}

export function DeliveryScheduleSection({ campaign }: DeliveryScheduleSectionProps) {
  // If no delivery schedule data, show placeholder
  if (!campaign.deliverySchedule || !campaign.goalLeads || !campaign.deliveredLeads) {
    return (
      <div className="glass-card p-6 mt-6">
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
          Delivery Schedule & Progress
        </h2>
        <div className="text-center py-8">
          <Package className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            No delivery schedule configured for this campaign
          </p>
        </div>
      </div>
    );
  }

  const today = new Date('2026-03-02T00:00:00Z'); // Current date from requirements
  const progressPercentage = Math.round((campaign.deliveredLeads / campaign.goalLeads) * 100);
  const remainingLeads = campaign.goalLeads - campaign.deliveredLeads;
  
  // Get completed and upcoming deliveries
  const completedDeliveries = campaign.deliverySchedule.filter(d => d.status === 'completed');
  const upcomingDeliveries = campaign.deliverySchedule.filter(d => d.status === 'upcoming');
  const nextDelivery = upcomingDeliveries[0];
  
  // Calculate days until next delivery
  const daysUntilNext = nextDelivery ? differenceInDays(parseISO(nextDelivery.date), today) : 0;
  
  // Get current week's deliveries (Mon Mar 2 - Sun Mar 8, 2026)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  const thisWeekDeliveries = campaign.deliverySchedule.filter(d => {
    const deliveryDate = parseISO(d.date);
    return (isSameDay(deliveryDate, weekStart) || isAfter(deliveryDate, weekStart)) && 
           (isSameDay(deliveryDate, weekEnd) || isBefore(deliveryDate, weekEnd));
  });

  // Generate week calendar (7 days from Monday)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Delivery cadence summary
  const deliveryCadence = campaign.deliveryDays?.join(' & ') || 'Custom Schedule';
  const avgLeadsPerDelivery = campaign.leadsPerDelivery || 0;

  // Calculate estimated completion date
  const remainingDeliveries = upcomingDeliveries.length;
  const estimatedCompletionDate = remainingDeliveries > 0 
    ? parseISO(upcomingDeliveries[upcomingDeliveries.length - 1].date) 
    : today;

  return (
    <div className="mt-6 space-y-6">
      {/* Header Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
            Delivery Schedule & Progress
          </h2>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: progressPercentage === 100 ? 'var(--color-success-bg)' : 'var(--color-info-bg)' }}>
            <TrendingUp className="w-4 h-4" style={{ color: progressPercentage === 100 ? 'var(--color-success)' : 'var(--color-info)' }} />
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: progressPercentage === 100 ? 'var(--color-success)' : 'var(--color-info)' }}>
              {progressPercentage === 100 ? 'Completed' : 'On Track'}
            </span>
          </div>
        </div>

        {/* Campaign Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
              Campaign Progress
            </span>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
              {campaign.deliveredLeads} / {campaign.goalLeads} leads
            </span>
          </div>
          <div className="relative w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #BA2027 0%, #D32F2F 100%)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              {progressPercentage}% Complete
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              {remainingLeads} leads remaining
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                Delivery Days
              </span>
            </div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              {deliveryCadence}
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                Per Delivery
              </span>
            </div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              {avgLeadsPerDelivery} leads
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                Completed
              </span>
            </div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              {completedDeliveries.length} batches
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" style={{ color: 'var(--color-warning)' }} />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-wide)' }}>
                Est. Completion
              </span>
            </div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              {format(estimatedCompletionDate, 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar & Upcoming Deliveries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Calendar View */}
        <div className="glass-card p-6">
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
            This Week's Schedule
          </h3>
          <div className="space-y-2">
            {weekDays.map((day, index) => {
              const delivery = campaign.deliverySchedule?.find(d => isSameDay(parseISO(d.date), day));
              const isToday = isSameDay(day, today);
              const hasDelivery = !!delivery;
              
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg transition-all"
                  style={{ 
                    background: isToday ? 'var(--color-primary-tint)' : hasDelivery ? 'var(--color-surface)' : 'transparent',
                    border: `1px solid ${isToday ? 'var(--color-primary)' : hasDelivery ? 'var(--color-border)' : 'transparent'}`
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex-shrink-0 w-16">
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {format(day, 'EEE')}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: isToday ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                      {format(day, 'MMM d')}
                    </div>
                  </div>
                  
                  {hasDelivery ? (
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {delivery.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                        ) : (
                          <Package className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                        )}
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                          Delivery Scheduled
                        </span>
                      </div>
                      <div className="px-2 py-1 rounded" style={{ background: delivery.status === 'completed' ? 'var(--color-success-bg)' : 'var(--color-info-bg)' }}>
                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: delivery.status === 'completed' ? 'var(--color-success)' : 'var(--color-info)' }}>
                          {delivery.leadsDelivered} leads
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                      No delivery
                    </div>
                  )}
                  
                  {isToday && (
                    <div className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: 'var(--color-primary)', color: 'white' }}>
                      Today
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deliveries */}
        <div className="glass-card p-6">
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
            Upcoming Deliveries
          </h3>
          {upcomingDeliveries.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeliveries.slice(0, 4).map((delivery, index) => {
                const deliveryDate = parseISO(delivery.date);
                const daysUntil = differenceInDays(deliveryDate, today);
                const isNext = index === 0;
                
                return (
                  <motion.div
                    key={index}
                    className="p-4 rounded-lg"
                    style={{ 
                      background: isNext ? 'var(--color-primary-tint)' : 'var(--color-surface)',
                      border: `1px solid ${isNext ? 'var(--color-primary)' : 'var(--color-border)'}`
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: isNext ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                          {format(deliveryDate, 'EEEE, MMM d, yyyy')}
                        </span>
                      </div>
                      {isNext && (
                        <div className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: 'var(--color-primary)', color: 'white' }}>
                          Next
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" style={{ color: 'var(--color-info)' }} />
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                          {delivery.leadsDelivered} leads expected
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-success)' }} />
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                All Deliveries Complete!
              </p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }} className="mt-1">
                This campaign has finished all scheduled deliveries.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Timeline */}
      <div className="glass-card p-6">
        <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }} className="mb-4">
          Delivery Timeline
        </h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ background: 'var(--color-border)' }} />
          
          <div className="space-y-4">
            {campaign.deliverySchedule.map((delivery, index) => {
              const deliveryDate = parseISO(delivery.date);
              const isCompleted = delivery.status === 'completed';
              const isPast = isBefore(deliveryDate, today);
              
              return (
                <motion.div
                  key={index}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Timeline Dot */}
                  <div 
                    className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: isCompleted ? 'var(--color-success)' : isPast ? 'var(--color-warning)' : 'var(--color-info)',
                      boxShadow: '0 0 0 4px var(--color-surface)'
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Package className="w-5 h-5 text-white" />
                    )}
                  </div>
                  
                  {/* Delivery Info */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                        {format(deliveryDate, 'EEEE, MMMM d, yyyy')}
                      </span>
                      <div className="px-2 py-1 rounded" style={{ background: isCompleted ? 'var(--color-success-bg)' : 'var(--color-info-bg)' }}>
                        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: isCompleted ? 'var(--color-success)' : 'var(--color-info)' }}>
                          {isCompleted ? 'Delivered' : 'Scheduled'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {delivery.leadsDelivered} leads {isCompleted ? 'delivered' : 'expected'}
                      </span>
                      {!isCompleted && (
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          • {differenceInDays(deliveryDate, today)} days remaining
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}