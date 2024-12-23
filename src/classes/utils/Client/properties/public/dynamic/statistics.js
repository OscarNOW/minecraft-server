const Changeable = require('../../../../Changeable.js');
const { customStatistics, statisticCategories, blocks, entities, items } = require('../../../../../../functions/loader/data.js');

module.exports = {
    statistics: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._statistics;
        },
        set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            const oldValue = JSON.parse(JSON.stringify(this.statistics));

            let newStatistics = [];
            for (const statistic of newValue) {
                if (statistic instanceof Changeable)
                    newStatistics.push(statistic);
                else
                    // when a specific object changes, we set the statistics to itself, so it updates
                    newStatistics.push(new Changeable(() => { this.statistics = this.statistics }, statistic));
            }

            this.p._statistics = newStatistics;

            if (!beforeReady)
                this.p.emitChange('statistics', oldValue);
        },
        init() {
            this.p._statistics = [];
            this.p.clientStatistics = [];
        },
        sendToClient() {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            let changedStatistics = [];

            // add all changed statistics to changedStatistics
            for (const statistic of this.p._statistics) {
                const clientStatistic = this.p.clientStatistics.find(s => s.category === statistic.category && s.statistic === statistic.statistic);
                if (!clientStatistic || clientStatistic.value !== statistic.value)
                    changedStatistics.push(statistic);
            }

            // if a statistic was removed, we set its value to 0
            for (const clientStatistic of this.p.clientStatistics) {
                const statistic = this.p._statistics.find(s => s.category === clientStatistic.category && s.statistic === clientStatistic.statistic);
                const changedStatistic = changedStatistics.find(s => s.category === clientStatistic.category && s.statistic === clientStatistic.statistic);

                if (!statistic && !changedStatistic)
                    changedStatistic.push({
                        category: clientStatistic.category,
                        statistic: clientStatistic.statistic,
                        value: 0
                    });
            }

            const minecraftStatistics = changedStatistics.map(({ category: categoryName, statistic: statisticName, value }) => {
                //todo: check for isNaN and throw error

                const categoryId = statisticCategories.findIndex(c => c.name === categoryName);
                let statisticId = null;

                const categoryUsing = statisticCategories[categoryId].using;

                if (categoryUsing === 'custom') {
                    statisticId = customStatistics.findIndex(s => s.name === statisticName);
                    const unit = customStatistics[statisticId].unit;

                    if (unit === null) { }
                    else if (unit === 'distance') {
                        // blocks to centimeters
                        value *= 100;
                    } else if (unit === 'time') {
                        // seconds to ticks
                        value *= 20;
                    } else if (unit === 'damage') {
                        // damage to weird statistic damage
                        value *= 10;
                    } else
                        throw new Error(`Unknown custom statistic unit in customStatistics data: ${unit}`);
                } else if (categoryUsing === 'blocks') {
                    statisticId = blocks.findIndex(([name]) => name === statisticName);
                } else if (categoryUsing === 'entities') {
                    statisticId = entities.findIndex(({ name }) => name === statisticName);
                } else if (categoryUsing === 'items') {
                    statisticId = items.find(({ name }) => name === statisticName).id;
                } else
                    throw new Error(`Unknown statistic category using in statisticCategories data: ${categoryUsing}`);

                value = Math.round(value);

                return {
                    categoryId,
                    statisticId,
                    value
                };
            });

            this.p.sendPacket('statistics', {
                entries: minecraftStatistics
            });

            this.p.clientStatistics = JSON.parse(JSON.stringify(this.p._statistics));
        }
    }
}