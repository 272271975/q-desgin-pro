<template>
    <div :class="[prefixCls + '-confirm']" @keydown.tab.capture="handleTab">
        <Button :class="timeClasses" size="small" type="text" :disabled="timeDisabled" v-if="showTime" @click="handleToggleTime">
            {{labels.time}}
        </Button>
        <Button size="small" type="primary" @click.native="handleClear" @keydown.enter.native="handleClear">
            {{labels.clear}}
        </Button>
        <Button size="small"  @click.native="handleSuccess" @keydown.enter.native="handleSuccess">
            {{labels.ok}}
        </Button>
    </div>
</template>
<script>
    import Button from '../../button/button.vue';
    import Locale from '../../../mixins/locale';
    // import Emitter from '../../../mixins/emitter';

    const prefixCls = 'qui-picker';

    export default {
        mixins: [Locale],
        components: { Button },
        props: {
            showTime: false,
            isTime: false,
            timeDisabled: false
        },
        data() {
            return {
                prefixCls: prefixCls
            };
        },
        computed: {
            timeClasses () {
                return  `${prefixCls}-confirm-time`;
            },
            labels(){
                const labels = ['time', 'clear', 'ok'];
                const values = [(this.isTime ? 'selectDate' : 'selectTime'), 'clear', 'ok'];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.t('i.datepicker.' + values[i]);
                    return obj;
                }, {});
            }
        },
        methods: {
            handleClear () {
                this.$emit('on-pick-clear');
            },
            handleSuccess () {
                this.$emit('on-pick-success');
            },
            handleToggleTime () {
                if (this.timeDisabled) return;
                this.$emit('on-pick-toggle-time');
                // this.dispatch('CalendarPicker', 'focus-input');
                // this.dispatch('CalendarPicker', 'update-popper');
            },
            handleTab(e) {
                const tabbables = [...this.$el.children];
                const expectedFocus = tabbables[e.shiftKey ? 'shift' : 'pop']();

                if (document.activeElement === expectedFocus) {
                    e.preventDefault();
                    e.stopPropagation();
                    // this.dispatch('CalendarPicker', 'focus-input');
                }
            }
        }
    };
</script>
